# Classe les visuels retenus (publications Instagram de assets/raw + images tirées des reels dans assets/frames)
# dans assets/<catégorie>/<nom>.jpg. Recadrage optionnel (gauche, haut, droite, bas en fractions).
#   python scripts/classify.py
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW, FRAMES = ROOT / "assets/raw", ROOT / "assets/frames"

def src(ref):
    if ref.startswith("r"):  # publication n° NNN : vignette yt-dlp sans icône « lecture » si elle existe
        thumb = ROOT / "assets/thumbs" / f"{ref[1:]}.jpg"
        return thumb if thumb.exists() else next(RAW.glob(f"orientale-du-sud_{ref[1:]}_*.jpg"))
    return FRAMES / f"{ref}.jpg"

M = {
    "hero": {
        "serveurs-cloches-dorees": ("DRejUopDE9i_12", None),
    },
    "mariages": {
        "service-cloches-tajine": ("DRejUopDE9i_13", None),
        "reception-jardin-soleil": ("DXzF-f2soh9_2", None),
        "service-tenue-traditionnelle": ("DXzF-f2soh9_12", None),
        "fontaine-fleurs-reception": ("DXzF-f2soh9_34", None),
        "serveurs-cloches-salle": ("r026", None),
        "serveurs-plateaux-dores": ("r086", None),
        "buffet-jardin-fleurs": ("r066", None),
        "maries-a-table": ("DIeR0ziItN2_22", None),
        "convives-jardin": ("DXzF-f2soh9_26", None),
    },
    "tables-reception": {
        "cheffe-plateaux-soleil": ("Dci0AOeDXul_3", None),
        "buffet-oriental-petales": ("DIeR0ziItN2_14", None),
        "tajine-bleu-petales": ("DIeR0ziItN2_2", None),
        "verres-voilage-olive": ("r014", None),
        "table-chandelier-roses": ("r118", None),
        "buffet-pieces-sucrees": ("r077", None),
        "buffet-pierre-serveurs": ("r034", None),
        "table-tajines-assiettes": ("r073", None),
        "table-bougie-roses": ("r011", None),
        "anniversaire-jardin": ("DaaLVHxIV8x_10", None),
        "table-dressee-salon": ("DIeR0ziItN2_18", None),
    },
    "sale": {
        "msemen": ("r024", None),
        "couscous-legumes": ("r048", None),
        "couscous-poulet-amandes": ("r094", None),
        "seffa": ("r067", None),
        "tajine-poulet-citron": ("DIeR0ziItN2_8", (0, 0.25, 1, 0.85)),
        "nids-kadaif-crevettes": ("r069", None),
        "triangles-kadaif": ("r102", None),
        "feuilletes-cocktail": ("r016", None),
        "tartelettes-olives": ("r055", None),
        "bouchees-tomate-cerise": ("r008", None),
        "salades-marocaines": ("DS412u3jE8V_50", None),
        "briouates": ("DcWNV0jNYks_16", None),
        "bouchees-briochees": ("r109", None),
    },
    "sucre": {
        "cornes-de-gazelle": ("r061", None),
        "chebakia": ("r085", None),
        "chebakia-miel": ("r023", None),
        "mignardises-pistache": ("r029", None),
        "patisseries-orientales": ("r030", None),
        "kadaif-pistache": ("r031", None),
        "verrines-fruits": ("r099", None),
        "verrines-chocolat": ("r100", None),
        "cupcakes": ("r060", None),
        "fekkas": ("r019", None),
        "the-a-la-menthe": ("r037", None),
        "service-the-jardin": ("r045", None),
    },
    "fruits": {
        "cascade-de-fruits": ("DbvKUENNgbP_28", None),
        "cascade-fruits-plateau": ("r005", None),
        "melon-garni": ("DbvKUENNgbP_26", None),
        "plateau-fruits-fromages": ("r108", None),
        "piece-montee-fruits": ("r052", None),
    },
    "equipe-coulisses": {
        "merci-2025": ("merci2025", (0, 0.275, 1, 0.86)),
        "equipe-briefing": ("DS412u3jE8V_24", None),
        "serveurs-sourires": ("DS412u3jE8V_62", None),
        "cheffe-portrait": ("DS412u3jE8V_14", None),
        "cheffe-cuisine-salades": ("DcWNV0jNYks_10", None),
        "cuisine-assiettes": ("DS412u3jE8V_54", None),
        "cheffe-fez": ("DS412u3jE8V_44", None),
        "cheffe-the-tenue": ("r090", None),
        "trio-equipe": ("r076", None),
        "complicite-cuisine": ("r078", None),
        "marche-produits-frais": ("DbLG2m_tF9L_40", None),
        "dressage-assiettes": ("DS412u3jE8V_32", None),
        "cheffe-decoration-douceurs": ("DaaLVHxIV8x_16", None),
        "deux-serveurs": ("r068", None),
    },
    "galerie": {
        "tables-fleuries-jardin": ("r035", None),
        "longue-table-pampa": ("r093", None),
        "buffet-brunch": ("r105", None),
        "verrines-jardin": ("r107", None),
        "arche-fleurs-blanches": ("r112", None),
        "salon-maries": ("r007", None),
        "salle-guirlandes": ("r092", None),
        "assiettes-dressees": ("r079", None),
    },
}

n = 0
for cat, items in M.items():
    out = ROOT / "assets" / cat
    out.mkdir(parents=True, exist_ok=True)
    for name, (ref, crop) in items.items():
        im = Image.open(src(ref)).convert("RGB")
        if crop:
            w, h = im.size
            im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
        im.save(out / f"{name}.jpg", quality=92)
        n += 1
print(n, "images classées")
