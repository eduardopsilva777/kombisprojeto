// Caminhos de imagem centralizados. Todas são fotos/artes oficiais publicadas no site atual,
// otimizadas por scripts/optimize-images.py. Para trocar uma foto, altere apenas este arquivo.

const photo = (name, alt, w = 960) => ({
  src: `/assets/img/${name}-480.webp`,
  srcset: `/assets/img/${name}-480.webp 480w, /assets/img/${name}-960.webp ${w}w`,
  width: 480,
  height: 480,
  alt,
});

export const IMAGES = {
  logo: { src: "/assets/img/logo-sticker-240.webp", srcset: "/assets/img/logo-sticker-240.webp 1x, /assets/img/logo-sticker-480.webp 2x", width: 240, height: 196, alt: "Kombi's Hot Dog" },
  kombi: { src: "/assets/img/kombi-640.webp", srcset: "/assets/img/kombi-640.webp 640w, /assets/img/kombi-1200.webp 1200w", width: 640, height: 387, alt: "Ilustração da Kombi laranja e preta do Kombi's Hot Dog" },
  og: "/assets/img/og-kombis.jpg",
  favicon: "/assets/img/favicon-512.png",
  appleTouch: "/assets/img/apple-touch-icon.png",
  tradicional: photo("hotdog-tradicional", "Hot dog com purê gratinado e batata palha servido na Kombi"),
  philadelphia: photo("hotdog-philadelphia", "Kombi Philadelphia com purê e cream cheese"),
  doritos: photo("hotdog-doritos", "Kombi Doritos/Philadelphia coberto com Doritos"),
  prensado: photo("hotdog-prensado", "Hot dog prensado cortado ao meio, mostrando as salsichas"),
  especial: photo("hotdog-especial", "Kombi Especial com purê e batata palha", 800),
  kids: photo("hotdog-kids", "Kombi Kids coberto de batata palha", 800),
};
