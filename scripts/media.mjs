// Prépare les images classées dans assets/<catégorie>/ pour le web :
// public/media/<catégorie>/<nom>.jpg (côté long 1600 px max ; next/image sert ensuite AVIF/WebP à la bonne taille).
// Recrée aussi la boucle vidéo du hero (reel DRejUopDE9i : les serveurs soulèvent les cloches dorées),
// ses images d'attente et l'image Open Graph.
//   npm run media
import { execFileSync } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "mariages", "tables-reception", "sale", "sucre", "fruits", "equipe-coulisses", "galerie"];

let n = 0;
const sizes = {};
for (const cat of CATS) {
  const src = path.join(ROOT, "assets", cat);
  const out = path.join(ROOT, "public/media", cat);
  await mkdir(out, { recursive: true });
  const files = (await readdir(src).catch(() => [])).filter((f) => /\.jpe?g$/i.test(f) && !f.startsWith("poster-"));
  for (const f of files) {
    const info = await sharp(path.join(src, f))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .modulate({ saturation: 0.97 })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(path.join(out, f));
    sizes[`/media/${cat}/${f}`] = [info.width, info.height];
    n += 1;
  }
}

// Boucle du hero : 6 s sans son. Horizontale (1348 × 1080 d'origine) et verticale recadrée pour mobile.
const reel = path.join(ROOT, "assets/video/DRejUopDE9i.mp4");
const HERO = { from: 9, duration: 6 };
const encode = (vf, file) =>
  execFileSync(ffmpeg, [
    "-loglevel", "error", "-y", "-ss", String(HERO.from), "-t", String(HERO.duration), "-i", reel,
    "-an", "-vf", `${vf},fps=30`, "-c:v", "libx264", "-profile:v", "high", "-crf", "26", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(ROOT, "public/media/hero", file),
  ]);
const poster = (vf, file) =>
  execFileSync(ffmpeg, ["-loglevel", "error", "-y", "-ss", String(HERO.from + 0.1), "-i", reel, "-frames:v", "1", "-vf", vf, "-q:v", "2", path.join(ROOT, "assets/hero", file)]);
const WIDE = "scale=1280:-2";
const TALL = "crop=608:1080:370:0";
try {
  encode(WIDE, "hero-wide.mp4");
  encode(TALL, "hero-tall.mp4");
  poster(WIDE, "poster-wide.jpg");
  poster(TALL, "poster-tall.jpg");
  for (const f of ["poster-wide.jpg", "poster-tall.jpg"]) {
    const info = await sharp(path.join(ROOT, "assets/hero", f)).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(ROOT, "public/media/hero", f));
    sizes[`/media/hero/${f}`] = [info.width, info.height];
  }
} catch (e) {
  console.warn("Vidéo du hero non recréée (assets/video absent ?)", e.message);
}

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image Open Graph 1200 × 630 : les serveurs et les cloches dorées
await sharp(path.join(ROOT, "assets/hero/serveurs-cloches-dorees.jpg"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${n} images prêtes`);
