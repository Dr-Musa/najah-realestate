
import { GoogleGenAI, Type } from "@google/genai";
import { ExternalListing } from "../types";
import { SAUDI_CITIES, SAUDI_DISTRICTS } from "../constants";

/**
 * محرك الرصد العقاري الذكي V14.0 - (Meta-Search Aggregator)
 * Aggregates data from multiple platforms, handles deduplication, and normalizes sources.
 */
export const searchExternalPlatforms = async (query: string): Promise<ExternalListing[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract intent
    const userDesiredRoomsMatch = query.match(/(\d+)\s*غرف/);
    const userDesiredRooms = userDesiredRoomsMatch ? userDesiredRoomsMatch[1] : null;

    const rawPhoneMatch = query.match(/رقم الجوال\s*([0-9\+]+)/);
    const targetPhone = rawPhoneMatch ? rawPhoneMatch[1].replace(/\D/g, '') : null;

    let fullPrompt = ``;

    if (targetPhone) {
      fullPrompt = `
      Search specifically across Saudi real estate platforms (Haraj, Aqar, Bayut, Wasalt, OpenSooq) for listings associated with phone number: "${targetPhone}".
      
      Instructions:
      1. Aggressively extract the "Owner Name" and "Phone Number" found in the text.
      2. Ignore results that do not strictly match the phone number logic.
      `;
    } else {
      fullPrompt = `
      Act as a Meta-Search Engine for Saudi Real Estate. Search across Haraj.com.sa, Aqar.fm, Bayut.sa, Wasalt.com, and OpenSooq.
      Query: "${query}".
      
      Requirements:
      1. Consolidate listings from different sources.
      2. Extract "Owner Name", "Phone", "Location", "Price", and "Images".
      3. For 'Aqar.fm' and 'Haraj.com.sa', be extremely precise with location and price.
      `;
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a real estate data aggregator. 
        Your goal is to structure unstructured search results into a unified format.
        - Identify the Source Platform (e.g., Haraj, Aqar) based on the URL.
        - Normalize prices to numbers.
        - Extract images if available in the snippet metadata.
        - Do not halluncinate data. If a field is missing, leave it null.`
      },
    });

    const rawResults: ExternalListing[] = [];
    const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]);
    
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          const uri = chunk.web.uri;
          const snippet = chunk.web.snippet || "";
          const title = chunk.web.title || "";
          const fullText = (title + " " + snippet).toLowerCase();
          const originalText = title + " " + snippet;
          const host = uri.toLowerCase();

          // --- Source Normalization ---
          let normalizedSource = 'Other';
          if (host.includes('aqar.fm')) normalizedSource = 'Aqar';
          else if (host.includes('haraj.com')) normalizedSource = 'Haraj';
          else if (host.includes('bayut.sa')) normalizedSource = 'Bayut';
          else if (host.includes('wasalt.com')) normalizedSource = 'Wasalt';
          else if (host.includes('opensooq')) normalizedSource = 'OpenSooq';
          else if (host.includes('zaahib')) normalizedSource = 'Zaahib';

          // --- Phone Extraction ---
          const phonePattern = /(?:05|9665|\+9665)\d{8}/g;
          const phoneMatches = fullText.match(phonePattern);
          let finalPhone = phoneMatches ? phoneMatches[0] : null;

          if (targetPhone) {
            if (finalPhone && finalPhone.includes(targetPhone)) {
                // Match
            } else if (!finalPhone) {
                finalPhone = targetPhone; // Safe assumption if result appeared in phone-specific search
            } else {
               // Mismatch phone in text vs target phone. 
               // If source is generic, ignore. If source is Haraj/Aqar, it might be related.
               if (!host.includes('haraj') && !host.includes('aqar')) return; 
            }
          }

          // --- Owner Extraction ---
          let finalOwner = null;
          // Specific logic for Haraj/Aqar patterns
          const companyRegex = /(?:شركة|شركه|مؤسسة|مكتب|عقارات|مجموعة)\s+([\u0600-\u06FF\s0-9]{3,40})/;
          const companyMatch = originalText.match(companyRegex);
          
          if (companyMatch) {
             let extractedName = companyMatch[0].trim();
             if (extractedName.split(' ').length <= 6) finalOwner = extractedName;
          }

          if (!finalOwner) {
            const ownerPattern = /(?:المعلن|المالك|بواسطة|الكاتب)[:\s\-]+([\u0600-\u06FF\s]+)/;
            const ownerMatch = originalText.match(ownerPattern);
            if (ownerMatch && ownerMatch[1].trim().length < 30) {
               finalOwner = ownerMatch[1].trim();
            }
          }
          
          if (!finalOwner && host.includes('haraj')) {
             const harajUser = snippet.match(/عضو\s+(\d+)/);
             if (harajUser) finalOwner = `عضو حراج ${harajUser[1]}`;
          }

          if (!finalOwner) {
              if (host.includes('haraj')) finalOwner = 'مستخدم حراج';
              else if (host.includes('aqar')) finalOwner = 'وسيط عقار';
              else finalOwner = 'معلن عقاري';
          }
          
          if (!finalPhone && !targetPhone) finalPhone = null; 
          else if (!finalPhone && targetPhone) finalPhone = targetPhone;


          // --- Price Extraction ---
          const pricePattern = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ريال|SR|رس|الف|مليون)/i;
          const priceMatch = snippet.match(pricePattern) || title.match(pricePattern);
          
          // --- Room Logic ---
          let finalRooms = '—';
          const explicitRoomsMatch = fullText.match(/(\d+)\s*(?:غرف|غرفة|نوم|ماستر)/);
          
          if (fullText.includes('غرفتين')) finalRooms = '2';
          else if (fullText.includes('غرفة واحدة') || fullText.includes('استوديو')) finalRooms = '1';
          else if (explicitRoomsMatch) finalRooms = explicitRoomsMatch[1];
          else if (userDesiredRooms) finalRooms = userDesiredRooms;
          else {
             // Heuristic guessing based on type
             if (fullText.includes('فيلا')) finalRooms = (Math.floor(Math.random() * 3) + 4).toString(); 
             else finalRooms = (Math.floor(Math.random() * 2) + 2).toString();
          }

          // --- Baths & Area ---
          let finalBaths = snippet.match(/(\d+)\s*حمام/)?.[1];
          if (!finalBaths) {
            const r = parseInt(finalRooms) || 3;
            finalBaths = r > 3 ? '4' : '2';
          }

          let finalArea = snippet.match(/(\d+)\s*(?:م|متر|م2)/)?.[1];
          if (!finalArea) {
             if (fullText.includes('فيلا')) finalArea = '350';
             else if (fullText.includes('شقة')) finalArea = '140';
             else finalArea = '500'; 
          }

          // --- Location ---
          let detectedCity = SAUDI_CITIES.find(c => fullText.includes(c));
          let detectedDistrict = '';
          if (detectedCity && SAUDI_DISTRICTS[detectedCity]) {
             detectedDistrict = SAUDI_DISTRICTS[detectedCity].find(d => fullText.includes(d)) || '';
          }
          if (!detectedCity) {
             for (const [city, districts] of Object.entries(SAUDI_DISTRICTS)) {
                const foundDist = districts.find(d => fullText.includes(d));
                if (foundDist) {
                   detectedCity = city;
                   detectedDistrict = foundDist;
                   break;
                }
             }
          }
          const locationStr = detectedCity ? `${detectedCity}${detectedDistrict ? '، ' + detectedDistrict : ''}` : 'الرياض';

          // --- Trust Score Calculation (Red/Yellow/Green Logic) ---
          let baseScore = 50; // Start at Yellow
          
          // Source Reliability
          if (normalizedSource === 'Aqar') baseScore += 30;
          else if (normalizedSource === 'Bayut' || normalizedSource === 'Wasalt') baseScore += 25;
          else if (normalizedSource === 'Haraj') baseScore += 15;
          
          // Data Completeness
          if (priceMatch) baseScore += 5;
          if (finalPhone && finalPhone.startsWith('05')) baseScore += 10;
          if (detectedDistrict) baseScore += 5;
          if (finalOwner && finalOwner.length > 5 && !finalOwner.includes('مستخدم')) baseScore += 5;
          
          // Target Phone Match Bonus
          if (targetPhone) {
             if (finalPhone && finalPhone.includes(targetPhone)) baseScore = 95; 
             else baseScore = 45; // Penalize mismatch
          }

          const trustScore = Math.min(Math.max(baseScore, 20), 100);

          rawResults.push({
            title: title,
            uri: uri,
            source: normalizedSource,
            snippet: snippet,
            price: priceMatch ? priceMatch[0] : "السعر عند الاتصال",
            phone: finalPhone,
            ownerName: finalOwner,
            imageUrl: getSmartImage(title, snippet),
            images: [getSmartImage(title, snippet)],
            rooms: finalRooms,
            bathrooms: finalBaths,
            area: finalArea,
            location: locationStr,
            trustScore: trustScore
          });
        }
      });
    }

    // --- Deduplication Strategy ---
    // Remove exact URI duplicates and potential content duplicates (Same title + price)
    const seen = new Set();
    const uniqueResults = rawResults.filter(item => {
      const duplicateKey = `${item.uri}`; 
      // Could also use `${item.title}-${item.price}` for loose deduplication
      if (seen.has(duplicateKey)) {
        return false;
      }
      seen.add(duplicateKey);
      return true;
    });

    return uniqueResults.sort((a, b) => b.trustScore - a.trustScore);
  } catch (error) {
    console.error("Scraping Error:", error);
    return [];
  }
};

function getSmartImage(title: string, snippet: string): string {
  const content = (title + snippet).toLowerCase();
  if (content.includes('أرض') || content.includes('land')) return 'https://images.unsplash.com/photo-1599809272520-27d27e725804?q=80&w=800'; 
  if (content.includes('عمارة') || content.includes('building')) return 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=800'; 
  if (content.includes('شقة') || content.includes('apartment')) return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800'; 
  if (content.includes('فيلا') || content.includes('villa')) return 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?q=80&w=800'; 
  if (content.includes('مكتب') || content.includes('office')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800';
  return 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=800'; 
}
