import { SITE } from "../data/site.js";
import { UNITS } from "../data/units.js";
import { IMAGES } from "../data/images.js";
import { mapsUrl } from "../components/unit.js";

// Dados estruturados apenas com informações verificadas no site oficial.
// Horários são omitidos das unidades com divergência entre páginas (hoursNote).
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}${IMAGES.favicon}`,
        foundingDate: String(SITE.foundedYear),
        sameAs: Object.values(SITE.social),
      },
      ...UNITS.map((u) => ({
        "@type": "FastFoodRestaurant",
        "@id": `${SITE.url}/#${u.id}`,
        name: `${SITE.name} – ${u.name} (${u.district})`,
        parentOrganization: { "@id": `${SITE.url}/#org` },
        url: `${SITE.url}/#unidades`,
        image: `${SITE.url}${IMAGES.og}`,
        servesCuisine: "Hot dog",
        menu: `${SITE.url}/cardapio/`,
        telephone: `+${u.phoneDelivery}`,
        hasMap: mapsUrl(u),
        address: {
          "@type": "PostalAddress",
          streetAddress: u.street,
          addressLocality: u.city,
          addressRegion: "SP",
          addressCountry: "BR",
        },
        ...(u.hoursNote ? {} : {
          openingHoursSpecification: [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: u.hours.open,
            closes: u.hours.close,
          }],
        }),
      })),
    ],
  };
}
