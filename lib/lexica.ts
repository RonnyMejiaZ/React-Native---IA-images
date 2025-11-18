import { Prompt } from "@/components/Main";

const LEXICA_API_URL = "https://lexica.art/api/infinite-prompts";
const PROXY_API_URL = "http://localhost:5000/api/lexica-proxy";

const MOCK_DATA_MODE = false;

const FULL_COOKIE_STRING =
  "__Secure-next-auth.callback-url=https%3A%2F%2Flexica.art; __Host-next-auth.csrf-token=94e05b3932545d9fb0b47502454aca7a270030113fa755d8b4d8c9852ccf1f70%7C530bf23f6f3d6aaaa15d2f8fc0c90ba90aa7daf47fe5872d3d26b3beb91a9125; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..g7lc16YSxGvSKEKd.km1FvZXLo32P0A1HGxZOdDi1gqg5wWuo9WVY0RR6Z0SgStPagJT5fPvsiG9BlClywq2dQ4QV1IaRKM7WxDTl57VM80JXzflVcixH3PEBrC7Ssqt7nQ7bWP3y-Fs9dtFl8WXV_Kd-8JTaFjsDpieUeVzoTjFCpVcf1A-gStCvNwM1gjgGHQk9zxw03YNHPZ_OhxHcwfOczcj7jgTVbdXl5xtRY3OjgwIVK-Hw4ESTgGw4kGP5IEog-cFljqx7qUewy69N3j_K8wCEt2JkxiM0pQIWAbYtfSSlu30T6oFgtMJ9wbb7Jc1tyqJt2pjbTY19kqWnBtcYvKG0RYE3oJyjEjg9O3XcXCPU6EPiIXpabwpTjVij4DzIjZpudJ2vk-z_UPHLDSn4fFJr8jXIp_DJjtnXXCBtE9M.AFCB7aPBzzs1dPtRA_aUZg";

const MOCK_PROMPT_DATA: Prompt[] = [
  {
    slug: "a-robot-in-a-cyberpunk-city",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop",
  },
  {
    slug: "mystic-forest-spirit",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=450&fit=crop",
  },
  {
    slug: "space-cat-on-moon",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    slug: "vaporwave-sunset",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
  },
  {
    slug: "dragon-digital-art",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=350&fit=crop",
  },
  {
    slug: "low-poly-castle",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop",
  },
  {
    slug: "coffee-cup-rain",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
  },
  {
    slug: "medieval-knight",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=480&fit=crop",
  },
  {
    slug: "abstract-geometry",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    slug: "futuristic-car",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  },
  {
    slug: "waterfall-landscape",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
  },
  {
    slug: "city-at-night",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=600&fit=crop",
  },
];

export async function generatePrompts(
  prompt: string,
  page: number = 1,
  perPage: number = 10
): Promise<Prompt[]> {
  if (MOCK_DATA_MODE) {
    console.log(`[MOCK MODE] Simulando carga para la página ${page} con prompt: "${prompt}"`);
    
    await new Promise((resolve) => setTimeout(resolve, 800));

    const offset = (page - 1) * perPage;
    const filteredData =
      prompt.toLowerCase() === "trending wallpaper" || prompt.toLowerCase() === "a trending wallpaper"
        ? MOCK_PROMPT_DATA
        : MOCK_PROMPT_DATA.filter((p) =>
            p.slug.toLowerCase().includes(prompt.toLowerCase())
          );

    const chunk = filteredData.slice(offset, offset + perPage);

    return chunk.map((p, i) => ({
      ...p,
      slug: `${p.slug}-${page}-${i}-${Date.now()}`,
    }));
  }

  try {
    const bodyPayload = {
      q: prompt,
      page: page,
      per_page: perPage,
    };

    const response = await fetch(PROXY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    if (response.status === 401) {
      throw new Error("401 No Autorizado. La Cookie de sesión ha caducado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Error en la petición: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log("Respuesta de Lexica recibida:", {
      hasData: !!data,
      hasImages: !!(data && Array.isArray(data.images)),
      imagesCount: data?.images?.length || 0,
      firstImage: data?.images?.[0],
      firstImageKeys: data?.images?.[0] ? Object.keys(data.images[0]) : [],
      firstImagePrompt: data?.images?.[0]?.prompt,
    });

    if (!data || !Array.isArray(data.images)) {
      console.warn("Respuesta de Lexica inesperada:", data);
      return [];
    }

    const prompts = data.images.map((img: any, index: number) => {
      let imageUrl = img.srcSmall || img.src || img.url || "";
      let textPrompt = img.prompt || img.promptText || img.description || img.text || img.query || "";
      const imageId = img.id;
      const slug = imageId || `${prompt.replace(/\s/g, "-")}-${page}-${index}`;
      
      const promptText = 
        img.prompt || 
        img.promptText || 
        img.description || 
        img.text ||
        img.query ||
        "";
      
      if (index === 0) {
        console.log("Primera imagen - Todos los campos disponibles:", Object.keys(img));
        console.log("Primera imagen - promptText extraído:", promptText);
        console.log("Primera imagen - img.prompt:", img.prompt);
        console.log("Primera imagen - img.description:", img.description);
      }
      
      if (!imageUrl && imageId) {
        imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;
        console.log(`Construida URL para imagen ${index} usando ID: ${imageUrl}`);
      }
      
      if (!imageUrl) {
        console.warn(`Imagen sin URL ni ID en índice ${index}:`, img);
      }

      if (!textPrompt || textPrompt.length === 0) {
        textPrompt = `https://lexica.art/prompt/${imageId}`;
        console.log(`Construida URL para prompt ${index} usando ID: ${textPrompt}`);
      }
      
      return {
        image: imageUrl,
        textPrompt: textPrompt,
        slug: slug,
      };
    });

    console.log(`Procesadas ${prompts.length} imágenes`);
    return prompts;
  } catch (error: any) {
    console.error("Fallo al contactar a la API de Lexica:", error.message);
    throw error;
  }
}
