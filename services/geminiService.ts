import { GoogleGenAI } from "@google/genai";

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Translate and Refine Prompt
 */
export const refinePrompt = async (
  userSubject: string, 
  styleModifier: string, 
  techniqueModifier: string,
  hasReference: boolean,
  similarityLevel: number = 8,
  colorScheme: string = "Black and Grey",
  complexity: string = "High Detail",
  placement: string = "Flat Stencil"
): Promise<string> => {
  try {
    let adherenceInstruction = "";
    if (hasReference) {
      if (similarityLevel >= 8) {
        adherenceInstruction = "CRITICAL: Strictly preserve the exact composition and structure of the reference image. Apply the style as an overlay.";
      } else if (similarityLevel >= 5) {
        adherenceInstruction = "Maintain the general silhouette but adapt internal details to the requested style.";
      } else {
        adherenceInstruction = "Use the reference only for basic thematic inspiration.";
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Sen bir Master Tattoo Artist ve Prompt Mühendisisin.
        
        PARAMETRELER:
        - Konu: "${userSubject}"
        - Stil: "${styleModifier}"
        - Teknik: "${techniqueModifier}"
        - Renk Paleti: "${colorScheme}"
        - Detay Seviyesi: "${complexity}"
        - Vücut Yerleşimi: "${placement}"
        - Referans: ${hasReference ? "Aktif (Adherence: " + similarityLevel + "/10)" : "Pasif"}

        GÖREV:
        Kullanıcının Türkçe fikrini profesyonel bir dövme tasarım promptuna dönüştür.

        ZORUNLU FORMAT KURALLARI:
        - "Tattoo design of [Subject]" ile başla.
        - "isolated on pure white background" ifadesini mutlaka ekle.
        - "2D Flat stencil", "clean outlines", "professional ink illustration" anahtar kelimelerini kullan.
        - Renk paletini (${colorScheme}) ve detay seviyesini (${complexity}) mutlaka işle.
        - Dövmenin ${placement} bölgesine uygun akışta (flow) çizilmesini belirt.
        - Çıktı SADECE İngilizce prompt cümlesi olmalı.

        ADHERENCE: ${adherenceInstruction}
      `,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Prompt refinement error:", error);
    throw new Error("Prompt işlenirken bir hata oluştu.");
  }
};

/**
 * Step 2: Generate Image
 */
export const generateTattooDesign = async (refinedPrompt: string, referenceImageBase64?: string | null): Promise<string> => {
  try {
    const parts: any[] = [];
    
    if (referenceImageBase64) {
      const base64Data = referenceImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data
        }
      });
      parts.push({
        text: `Redesign this image as a high-quality tattoo stencil using this guide: ${refinedPrompt}`
      });
    } else {
      parts.push({ text: refinedPrompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Görsel oluşturulamadı.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Dövme tasarımı oluşturulurken bir hata meydana geldi.");
  }
};