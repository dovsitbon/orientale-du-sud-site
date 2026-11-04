# Redessine le logo de L'Orientale du Sud en tracés SVG (aucune police à charger pour l'afficher).
# D'après leur logo Instagram : disque sable doré à motif d'étoiles entrelacées,
# « L'Orientale du Sud » en lettres blanches à empattements doux (police la plus proche : Kurale, licence OFL).
#
#   pip install fonttools
#   python scripts/logo.py
#
# Écrit data/logo.json (tracés utilisés par components/Logo.tsx et l'ouverture),
# public/logo.svg (version complète), public/logo-mark.svg (nom seul) et app/icon.svg (étoile au trait).
import json
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
font = TTFont(os.path.join(ROOT, "scripts/fonts/Kurale-Regular.ttf"))
cmap = font.getBestCmap()
gs = font.getGlyphSet()
upm = font["head"].unitsPerEm

# Crénage simple (paires GPOS non lues : on règle à l'œil les quelques paires du nom)
KERN = {("L", "’"): -0.11, ("’", "O"): -0.03, ("t", "a"): -0.01, ("S", "u"): -0.01}


def word(text, size, x0, baseline):
    """Une liste de tracés (un par lettre) et la largeur totale."""
    s = size / upm
    x = x0
    out = []
    prev = None
    for ch in text:
        if prev and (prev, ch) in KERN:
            x += KERN[(prev, ch)] * size
        g = cmap[ord(ch)]
        if ch != " ":
            pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
            gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, baseline)))
            out.append(pen.getCommands())
        x += font["hmtx"][g][0] * s * (0.72 if ch == " " else 1)
        prev = ch
    return out, x - x0


NAME = "L’Orientale du Sud"
SIZE = 100
glyphs, width = word(NAME, SIZE, 0, 0)
asc = 0.74 * SIZE  # hauteur des capitales / ascendantes de Kurale (≈)
# Boîte du nom seul (header) : marge fine autour des lettres
pad = 4
mark_vb = f"{-pad} {-asc - pad - 6} {width + 2 * pad:.1f} {asc + 2 * pad + 28:.1f}"

# Étoile marocaine (khatam) : deux carrés entrelacés + étoile intérieure, au trait
def star_path(cx, cy, r):
    pts = []
    for k in range(2):
        a0 = math.pi / 4 * k
        sq = [(cx + r * math.cos(a0 + math.pi / 2 * i), cy + r * math.sin(a0 + math.pi / 2 * i)) for i in range(4)]
        pts.append("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in sq) + " Z")
    return " ".join(pts)


def star8(cx, cy, r_out, r_in):
    p = []
    for i in range(16):
        r = r_out if i % 2 == 0 else r_in
        a = -math.pi / 2 + i * math.pi / 8
        p.append(f"{cx + r * math.cos(a):.2f} {cy + r * math.sin(a):.2f}")
    return "M" + " L".join(p) + " Z"


star = star_path(50, 50, 34)
star_inner = star8(50, 50, 16, 9)

# Version complète : disque 600 × 600, nom centré
D = 600
full_scale = 440 / width
full = {
    "viewBox": f"0 0 {D} {D}",
    "transform": f"translate({(D - width * full_scale) / 2:.1f} {D / 2 + asc * full_scale / 2 - 6:.1f}) scale({full_scale:.4f})",
}

data = {
    "glyphs": glyphs,
    "width": round(width, 1),
    "markViewBox": mark_vb,
    "star": star,
    "starInner": star_inner,
    "full": full,
}
with open(os.path.join(ROOT, "data/logo.json"), "w", encoding="utf8") as f:
    json.dump(data, f, ensure_ascii=False)

# Motif d'étoiles entrelacées (filigrane du disque), en tuile de 120 px
def lattice():
    t = 120
    parts = []
    for cx, cy in [(0, 0), (t, 0), (0, t), (t, t), (t / 2, t / 2)]:
        parts.append(star_path(cx, cy, 38))
        parts.append(star8(cx, cy, 22, 13))
    return " ".join(parts)


pattern = lattice()
SAND, GOLD, CREAM = "#D8B878", "#B89150", "#FBF6EC"
name_paths = "".join(f'<path d="{g}"/>' for g in glyphs)

logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {D} {D}">
<defs><pattern id="p" width="120" height="120" patternUnits="userSpaceOnUse"><path d="{pattern}" fill="none" stroke="{GOLD}" stroke-width="2" opacity=".55"/></pattern>
<clipPath id="c"><circle cx="{D/2}" cy="{D/2}" r="{D/2}"/></clipPath></defs>
<g clip-path="url(#c)"><rect width="{D}" height="{D}" fill="{SAND}"/><rect width="{D}" height="{D}" fill="url(#p)"/></g>
<g fill="#fff" stroke="#fff" stroke-width="2.4" transform="{full['transform']}">{name_paths}</g>
</svg>
'''
with open(os.path.join(ROOT, "public/logo.svg"), "w", encoding="utf8") as f:
    f.write(logo_svg)

with open(os.path.join(ROOT, "public/logo-mark.svg"), "w", encoding="utf8") as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{mark_vb}"><g fill="#2B231C" stroke="#2B231C" stroke-width="2.4">{name_paths}</g></svg>\n')

icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" rx="50" fill="{SAND}"/>
<path d="{star}" fill="none" stroke="#fff" stroke-width="4.2" stroke-linejoin="round"/>
<path d="{star8(50, 50, 13, 7.5)}" fill="#fff"/>
</svg>
'''
with open(os.path.join(ROOT, "app/icon.svg"), "w", encoding="utf8") as f:
    f.write(icon)
print("ok", round(width, 1), mark_vb)
