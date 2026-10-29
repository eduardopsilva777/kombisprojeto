"""Gera as versões otimizadas (WebP) das imagens oficiais da marca.

Uso: python -I scripts/optimize-images.py <pasta-com-originais>

Os originais são os arquivos publicados em static.wixstatic.com pelo site atual.
A saída vai para src/assets/img/ e é referenciada em src/data/images.js.
"""
import sys
from pathlib import Path
from PIL import Image

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# nome final -> arquivo original no Wix
PHOTOS = {
    "hotdog-tradicional": "b96035_fe2fd232168d4516b026a99098fcf576~mv2.png",
    "hotdog-philadelphia": "b96035_7e525ff946ab468885506d876d67d364~mv2.png",
    "hotdog-doritos": "b96035_b321882c5cdd4daebe5418cf407bb10a~mv2.png",
    "hotdog-prensado": "b96035_93d41ce006d548f6b64e49c35276b1b0~mv2.png",
    "hotdog-especial": "0fdb00_d6b81d5e9215425d9fa6f63d360bbf49~mv2.jpg",
    "hotdog-kids": "0fdb00_7a97da6386b54d07bc36219c309b68de~mv2.jpg",
}


def save(im, name, width, quality=78):
    im = im.copy()
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path = OUT / f"{name}-{width}.webp"
    im.save(path, "WEBP", quality=quality, method=6)
    print(f"{path.name:36} {im.size} {path.stat().st_size // 1024} KB")


for name, src in PHOTOS.items():
    im = Image.open(SRC / src).convert("RGB")
    for w in (480, 960):
        save(im, name, w)

kombi = Image.open(SRC / "0fdb00_c1c4b0dd69fd4d04a5d1cdc9b2df6173~mv2_d_2441_1440_s_2.png").convert("RGBA")
kombi = kombi.crop(kombi.getbbox())
for w in (640, 1200):
    save(kombi, "kombi", w, quality=82)

sticker = Image.open(SRC / "0fdb00_8b67226de1054aa7aa6eded290f6ffab~mv2.png").convert("RGBA")
sticker = sticker.crop(sticker.getbbox())
save(sticker, "logo-sticker", 240, quality=90)
save(sticker, "logo-sticker", 480, quality=90)
fav = sticker.copy()
fav.thumbnail((512, 512))
canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
canvas.alpha_composite(fav, ((512 - fav.width) // 2, (512 - fav.height) // 2))
canvas.save(OUT / "favicon-512.png", optimize=True)
canvas.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)

# Open Graph: foto oficial em 1200x630
og = Image.open(SRC / PHOTOS["hotdog-doritos"]).convert("RGB")
og = og.resize((1200, 1200), Image.LANCZOS).crop((0, 300, 1200, 930))
og.save(OUT / "og-kombis.jpg", quality=82, optimize=True, progressive=True)
print("ok")
