# L'Orientale du Sud — infos à demander à la cliente

Textes du site : `locales/fr.json`, `locales/en.json`, `locales/ar.json`. Carte et prix : `data/menu.json`. Coordonnées et zone : `data/site.json`.

1. Prénom et histoire de la cheffe (Sarah ?), à ajouter dans la section « L'équipe ».
2. Carte complète et vrais prix : les prix de `data/menu.json` sont des **exemples à remplir**. La pastilla manque faute de photo.
3. Formules mariage (buffet, service à table, cocktail) et prix de départ par personne.
4. Zone exacte des événements et de la livraison, frais de livraison, adresse de retrait.
5. Délai minimum de commande (2 jours par défaut) et créneaux de retrait ou de livraison.
6. Casher, halal, certifications ?
7. Raison sociale, SIRET, adresse, responsable de publication (mentions légales).
8. Vrais retours clients de la story « Retours » (`data/reviews.json`) : aucun avis n'a été inventé.
9. Vidéos originales en bonne qualité (hero, coulisses), sans texte incrusté.
10. Bannière Ramadan : `data/saison.json` (`active: true/false`).
11. E-mail de notification (Resend) : variables Vercel `RESEND_API_KEY`, `NOTIFY_EMAIL`, `RESEND_FROM`. Paiement Stripe désactivé : `NEXT_PUBLIC_PAYMENT_MODE=stripe` + `STRIPE_SECRET_KEY` pour l'activer.
