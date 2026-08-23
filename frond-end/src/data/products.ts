import { Product, Review } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'lavande-olive',
    name: 'Savon Lavande & Olive',
    nameEn: 'Lavender & Olive Soap',
    tagline: 'Apaisant & Nourrissant',
    taglineEn: 'Soothing & Deeply Nourishing',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 48,
    tags: ['Apaisant', 'Nourrissant', 'Surgras 8%'],
    description: 'Un rituel de purification doux, saponifié à froid. Enrichi en huile d\'olive vierge et délicatement parfumé aux huiles essentielles de lavande fine pour apaiser l\'esprit et la peau.',
    descriptionEn: 'A gentle cold-processed cleansing ritual. Enriched with virgin olive oil and subtly scented with fine lavender essential oil to soothe body and mind.',
    longDescription: 'Fabriqué à la main selon la méthode traditionnelle de saponification à froid, ce savon conserve naturellement toute sa glycérine végétale. Sa formule surgrasse à 8% nourrit intensément sans tiraillement, tandis que la lavande vraie de Haute-Provence diffuse ses notes florales relaxantes.',
    longDescriptionEn: 'Handmade using the ancestral cold saponification method, this soap naturally preserves all plant glycerin. Its 8% superfatted formula intensely nourishes without tightness, while true Haute-Provence lavender diffuses relaxing floral notes.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwCbWmWoXE74klOtwIQUnPMNLkGYreJ-ztS8FJiNnCCUsxn0agfBVH4MH1Rfx8oBpvjLOHrl5kMK0I7tm4fD_b6YvmWPsXSHWdIKppxjgVjAJR7J8vGKKpybh5I1XvQfX4hRW84SlX8EFMJIabfTsa3I3FbZTuojSDSJrCi0z39yNoRZ4OtPm0WZqUIudhfNXU5NBBFxOqOQTUWPu9FXMztN7ph1aT1d2Vrdsyrl3szRbrKhRORn3-',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfVa4uWlVQQpoJVHZPOCf7a45MyiW_fOLdcVdPbBizjVczUZThTL-_I5MAeKM8Ig4vnEm_XHOyo3iTTMfiYhfQ2WluleixsS44kQvvU5ntbwTz6IDw_yKgJrwWvwlXsT4XimHCmRHUC7h2dwMEXmZiugjIxxOM8E7xy0zGIkFRrWIconyI2cDMAlfSMLqwPOULdnw6PW61n32exDwHM7NzIEn0N4SdSAUAFlZK867Gq9aR9fkhP_ji',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6yfvIazOY3R4XUF5XEgb_8ZUDmsXZABEqST8M8JElbUrYyMX-4G_AbAtqbtViLO28Kzh5Sqt2lHu49LyK1Ixvq6VzZM-ADJ3sI8pj3fKFHZ9knVXAnMnBeRs58cyvdLXtHT_GvdYNolaikKDatZ_MdG5bR0Ag_pO-Z0x-570UXI_WroFkATbiP5gmd20WwNeku_aSVMliYAjcS5S0uW7HHjaaymvT7AXjDCrxPK34YPydBPh_-F5-'
    ],
    aspectRatio: 'square',
    ingredients: [
      {
        name: 'Huile d\'Olive Extra Vierge',
        description: 'Riche en antioxydants, elle nourrit en profondeur et protège le film hydrolipidique de la peau.',
        icon: 'spa',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      },
      {
        name: 'Lavande Fine de Provence',
        description: 'Propriétés calmantes et cicatrisantes, offre une expérience olfactive relaxante et sereine.',
        icon: 'local_florist',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      },
      {
        name: 'Beurre de Karité Brut',
        description: 'Apporte une onctuosité exceptionnelle à la mousse et répare durablement les peaux sèches.',
        icon: 'eco',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      }
    ],
    usageTips: 'Faites mousser entre vos mains sous l\'eau tiède, massez délicatement sur le corps en effectuant des mouvements circulaires, puis rincez abondamment. Pour prolonger la durée de vie de votre savon, conservez-le sur un porte-savon ajouré à l\'abri de l\'eau stagnante.',
    usageTipsEn: 'Lather between your hands under warm water, gently massage all over the body in circular motions, then rinse thoroughly. Store on a draining soap dish.',
    shippingInfo: 'Livraison standard (3-5 jours ouvrés) gratuite à partir de 50€ d\'achat. Retours acceptés dans un délai de 14 jours si le produit n\'a pas été utilisé et est dans son emballage d\'origine.',
    shippingInfoEn: 'Standard shipping (3-5 days) free from 50€. 14-day returns on unopened items.',
    surgrasPercentage: '8%',
    scentProfile: 'Floral provençal, boisé délicat, herbacé doux',
    scentProfileEn: 'Provencal floral, delicate woody, sweet herbal',
    weight: '120g',
    featured: true,
    
    // Stocks & Seuil (Phase 2)
    stock: 28,
    lowStockThreshold: 5,
    
    // Mentions GPSR & Cosmétique UE (Phase 2 / Phase 5)
    inci: 'Sodium Olivate, Sodium Cocoate, Sodium Shea Butterate, Aqua, Glycerin, Lavandula Angustifolia Oil, Linalool*, Limonene*, Geraniol* (*naturellement présents dans les huiles essentielles).',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-LO01',
    pao: '18M'
  },
  {
    id: 'eucalyptus-clay',
    name: 'Eucalyptus & French Clay',
    nameEn: 'Eucalyptus & French Clay',
    tagline: 'Purifiant & Clarifiant',
    taglineEn: 'Purifying & Clarifying',
    category: 'soaps',
    price: 24.00,
    rating: 4.9,
    reviewCount: 36,
    tags: ['Eucalyptus', 'Argile Verte', 'Purifiant'],
    description: 'Rituel purifiant avec légère exfoliation. Savon clarifiant formulé à l\'argile verte française et à l\'eucalyptus sauvage stimulant.',
    descriptionEn: 'Clarifying cleansing ritual with gentle exfoliation. Formulated with French green clay and stimulating wild eucalyptus.',
    longDescription: 'Infusé d\'argile verte française ultra-ventilée et d\'huile essentielle d\'eucalyptus globulus bio, ce pain purifiant désincruste délicatement les pores sans assécher. Idéal pour revitaliser le corps après l\'effort ou pour réveiller les sens lors de la douche matinale.',
    longDescriptionEn: 'Infused with French green clay and organic eucalyptus globulus essential oil, this purifying bar unblocks pores without stripping moisture. Perfect for a refreshing morning shower.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgSPAGqqr39UQOMlZYiMS8kCZ1VYN0TMC9lyp2GHS1cePZTgDqcf-59dRZFmErpAoFe8VCPVDEqSlNVIqOD86_6tLNW7xF71McBzPe_c30udQHwC28gANFMWo9GvwSeydIOvd3-kjYK5HMq0ydYI_SF4lm_ljS0Vf46Wf1jnVQ-Bcak0IRrDUU10nsOzpvW1UkKJDNwOT-fhyqxByTFCjLoJ4yqJHq1kB-kguW5hJwtpwEYgn5Xygr',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNTSDFYtxuWmgpoWAC4BrVvEkgJwJg-UIe4AoUSDu1VCUhYOwmVQBhZy94MLcXBV8qE_A2896fqD5Zpv-eUzznCMPkKki6-GT9HlUPFuTkUCXQfZDoUMV79PjxTjrlkJEONPixoOoxLxSCs5kzNZjE1JcQU6fGDsINu0NE3C9TMirtluTbR9jiD8nAAIx0EWI-I_hkuUkC941rUPDOtbnAyPCDTEXD_jPbqIYdNNvFEWTH1cRFFxn7'
    ],
    aspectRatio: 'square',
    ingredients: [
      {
        name: 'Argile Verte Française',
        description: 'Capte les impuretés et régule l\'excès de sébum grâce à ses minéraux précieux.',
        icon: 'terrain',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      },
      {
        name: 'Eucalyptus Sauvage',
        description: 'Procure un effet de fraîcheur vivifiant et dégage les voies respiratoires sous la vapeur.',
        icon: 'psychiatry',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      },
      {
        name: 'Huile de Ricin Première Pression',
        description: 'Génère une mousse dense et enveloppante aux propriétés adoucissantes.',
        icon: 'water_drop',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      }
    ],
    usageTips: 'Appliquez directement le pain sur la peau mouillée pour un léger effet exfoliant et massant, ou faites mousser entre les mains pour une texture plus veloutée.',
    usageTipsEn: 'Apply directly onto wet skin for a light exfoliating and massaging effect, or lather between hands.',
    shippingInfo: 'Expédition sous 24-48h. Emballage 100% recyclable sans plastique avec papier kraft compostable.',
    shippingInfoEn: 'Dispatched within 24-48h. Zero plastic packaging.',
    surgrasPercentage: '7%',
    scentProfile: 'Frais, camphré, herbacé purifiant',
    scentProfileEn: 'Fresh, invigorating camphor, clarifying herbal',
    weight: '120g',
    featured: true,
    
    // Stocks & Seuil (Phase 2) - Stock bas pour démonstration de l'alerte !
    stock: 4,
    lowStockThreshold: 5,
    
    // Mentions GPSR
    inci: 'Sodium Olivate, Sodium Cocoate, Sodium Castorate, Aqua, Glycerin, Montmorillonite (French Green Clay), Eucalyptus Globulus Leaf Oil, Limonene*.',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-EC02',
    pao: '18M'
  },
  {
    id: 'wild-orange-cedar',
    name: 'Wild Orange & Cedar',
    nameEn: 'Wild Orange & Cedar',
    tagline: 'Énergisant & Réconfortant',
    taglineEn: 'Grounding & Uplifting',
    category: 'soaps',
    price: 24.00,
    rating: 4.8,
    reviewCount: 29,
    tags: ['Orange Douce', 'Cèdre de l\'Atlas', 'Energisant'],
    description: 'Un accord vivifiant d\'écorces d\'oranges sauvages sucrées et de notes boisées chaudes de cèdre de l\'Atlas.',
    descriptionEn: 'An invigorating blend of sweet wild orange peel and warm Atlas cedarwood notes.',
    longDescription: 'Ce savon terracotta chaud célèbre les vergers ensoleillés et les forêts d\'altitude. Parfumé à l\'orange douce de Sicile et au bois de cèdre de l\'Atlas, il réchauffe l\'atmosphère du bain et redonne vitalité aux peaux fatiguées.',
    longDescriptionEn: 'This warm terracotta soap celebrates sunny orchards and altitude forests with Sicilian sweet orange and Atlas cedarwood.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAccw4AYiDmeTWK6xuxejzofycrhgqPctrGd_Vc_EBpVWEfFj0lX8JHF1FyvMr5LedXsoRMj-YPZbLHLOlsaT8KR4DD44UdIxtUC3-o_r-VadYpGa7PmG5-nl7MxK9Ogz6SCglG7GHkTbPp1Hs9DeH3tVSnglXy281tEJGoQ3Slj0NmD5Z_NUquKHMfTNysiqk30K2pFEijE_PUY2p-QVbIwac5R7yo65UosTyTUlK4z94D5ku7_h9a',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQos6I8xLro9gluD79yAfRwVOtdnQLuvKxZL5il1VkG0acC4U57cCpU3a1slkDk0tqzO5GSLMwr6fQGMYm9GSp5-Dg3CLxnllku77mPwkcW_1cfyXh34SmWpHrNAk2V4YDQ4I0ko_DXazQmymITdRXLYcW0zQ6bpbguJtr-m4Pa4ZqXkfUFLRULqbtUjRtcPpadVGOpXUBCKt1_1t_rdHoPl6WB68PTLuv0SUN9JlEex_dtPr5zM1I'
    ],
    aspectRatio: 'portrait',
    ingredients: [
      {
        name: 'Orange Douce & Zestes',
        description: 'Apporte un coup d\'éclat au teint et diffuse une fragrance d\'agrumes tonifiante.',
        icon: 'wb_sunny',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      },
      {
        name: 'Cèdre de l\'Atlas',
        description: 'Arôme boisé noble aux vertus apaisantes, tonifiantes pour l\'ancrage émotionnel.',
        icon: 'forest',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      },
      {
        name: 'Huile de Coco Vierge',
        description: 'Nettoie efficacement tout en favorisant une mousse abondante et crémeuse.',
        icon: 'spa',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      }
    ],
    usageTips: 'Idéal pour le matin. Inspirez profondément les effluves d\'agrumes et de bois précieux sous l\'eau tiède.',
    usageTipsEn: 'Ideal for your morning routine. Inhale deeply under warm water.',
    shippingInfo: 'Livraison neutre en carbone. Satisfait ou remboursé sous 14 jours.',
    shippingInfoEn: 'Carbon neutral delivery. 14-day money back guarantee.',
    surgrasPercentage: '8%',
    scentProfile: 'Agrumes chaleureux, bois de cèdre, ambre subtil',
    scentProfileEn: 'Warm citrus, Atlas cedarwood, subtle amber',
    weight: '120g',
    featured: true,
    
    // Stocks & Seuil
    stock: 19,
    lowStockThreshold: 5,
    
    // Mentions GPSR
    inci: 'Sodium Olivate, Sodium Cocoate, Sodium Shea Butterate, Aqua, Glycerin, Citrus Aurantium Dulcis (Orange) Peel Oil, Cedrus Atlantica Bark Oil, Limonene*, Citral*.',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-WOC03',
    pao: '18M'
  },
  {
    id: 'oat-milk-honey',
    name: 'Oat Milk & Honey',
    nameEn: 'Oat Milk & Raw Honey',
    tagline: 'Ultra-doux & Hypoallergénique',
    taglineEn: 'Ultra-Gentle & Hypoallergenic',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 52,
    tags: ['Lait d\'Avoine', 'Miel Brut', 'Sans Parfum'],
    description: 'Formule ultra-douce sans parfum ajouté, formulée spécialement pour les peaux sensibles et délicates au lait d\'avoine bio et miel brut.',
    descriptionEn: 'Fragrance-free formula crafted for sensitive and reactive skin with organic oat milk and raw honey.',
    longDescription: 'Conçu sans parfum ajouté pour respecter les épidermes les plus réactifs, ce pain d\'une douceur infinie allie le lait d\'avoine colloïdal apaisant au miel brut récolté localement. Il laisse un voile protecteur velouté sur la peau.',
    longDescriptionEn: 'Formulated fragrance-free for fragile and sensitive skin, this gentle bar blends soothing colloidal oat milk with raw local honey.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqmmq7L5lpvdOOsaYE6-TK7qi7qp8PWt-lqjXnS6RtLY9UUfeexLgTa2VZedP9qpL9Z0Z0mYUFuPNNhlRw2l-3uAJqkq6dx_NWdOvpIB5vzYZ3DNtE5qAHotHDlkNUxmrZvQu0ylvKSXjirFwlX5X95KftNX6wR-BrsDMpthueb-GLsCrY9HaGVkHvg2hnDqbrb56-ionbGEbRNqpgsgqbnWMh1GI88-CdgJEBWofmlBpVO0gKfr9Z'
    ],
    aspectRatio: 'square',
    ingredients: [
      {
        name: 'Lait d\'Avoine Bio',
        description: 'Calme instantanément les démangeaisons, rougeurs et sensations d\'inconfort cutané.',
        icon: 'grass',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      },
      {
        name: 'Miel Brut de Fleurs Sauvages',
        description: 'Humectant naturel exceptionnel qui capte l\'hydratation au cœur de l\'épiderme.',
        icon: 'hive',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      },
      {
        name: 'Beurre de Cacao Non Raffiné',
        description: 'Crée une barrière lipidique douce qui préserve la souplesse de la peau.',
        icon: 'spa',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      }
    ],
    usageTips: 'Parfait pour le visage et le corps de toute la famille, y compris les peaux à tendance atopique.',
    usageTipsEn: 'Perfect for face and body, suitable for the entire family and reactive skin types.',
    shippingInfo: 'Emballé dans un étui en papier de graines ensemencées prêt à planter.',
    shippingInfoEn: 'Packaged in plantable wildflower seed paper.',
    surgrasPercentage: '9%',
    scentProfile: 'Naturel, gourmandise subtile d\'avoine et de miel tiède',
    scentProfileEn: 'Naturally unscented, gentle warm oat and raw honey note',
    weight: '120g',
    featured: true,
    
    // Stocks & Seuil
    stock: 35,
    lowStockThreshold: 5,
    
    // Mentions GPSR
    inci: 'Sodium Olivate, Sodium Cocoa Butterate, Sodium Shea Butterate, Aqua, Avena Sativa (Oat) Kernel Extract, Glycerin, Mel (Raw Honey).',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-OMH04',
    pao: '18M'
  },
  {
    id: 'savon-signature',
    name: 'Le Savon Signature',
    nameEn: 'The Signature Ndolo Soap',
    tagline: 'L\'icône Ndolo au marbre végétal',
    taglineEn: 'The Ndolo Iconic Botanical Marble Bar',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 64,
    tags: ['Signature', 'Surgras 8%', '100% Naturel'],
    description: 'Transformez votre douche en rituel. Notre savon signature allie des ingrédients bruts d\'exception pour une expérience sensorielle inégalée.',
    descriptionEn: 'Elevate your daily shower into a sacred ritual. Our iconic signature bar combines raw precious ingredients.',
    longDescription: 'Pièce maîtresse de la maison Ndolo, ce savon marbré aux reflets sauge et écru associe les vertus de la lavande séchée, des huiles nobles et d\'un surgras protecteur de 8%. Chaque pièce est découpée et estampillée à la main dans notre atelier provençal.',
    longDescriptionEn: 'Masterpiece of the Ndolo atelier, this marbled soap blends dried wild lavender, noble cold-pressed oils, and 8% protective superfatting.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlb95X_tVwmD75ICxZBkyfNbkuJQlEKNCEA9gfFxN3wjMJCtQW9bNfEYPyAL6OnHIFjvTgYsal78OwB5elaEfx0VhGwOJ0SEPT6MPvnfSOk3DMVtc5u5k7Bn4tPzwjdWgH0wR8CkQkl87OsJhk_exEX-VMQxPmab7RjsjVFD-EydgaCgpjEM4IF7Vu_ooaHuy1EpbhhSIjYtdTtboyqn6nOkRIp3pDWATbccTDBPMZwxi1e5c504Lc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQos6I8xLro9gluD79yAfRwVOtdnQLuvKxZL5il1VkG0acC4U57cCpU3a1slkDk0tqzO5GSLMwr6fQGMYm9GSp5-Dg3CLxnllku77mPwkcW_1cfyXh34SmWpHrNAk2V4YDQ4I0ko_DXazQmymITdRXLYcW0zQ6bpbguJtr-m4Pa4ZqXkfUFLRULqbtUjRtcPpadVGOpXUBCKt1_1t_rdHoPl6WB68PTLuv0SUN9JlEex_dtPr5zM1I'
    ],
    aspectRatio: 'square',
    ingredients: [
      {
        name: 'Huile d\'Olive Vierge Pressée à Froid',
        description: 'Nourrit intensément et renforce le film hydrolipidique sans obstruer les pores.',
        icon: 'spa',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      },
      {
        name: 'Glycérine Naturelle Préservée',
        description: 'Issue de la saponification lente pour retenir l\'eau dans la peau.',
        icon: 'water_drop',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      },
      {
        name: 'Graines de Pavot & Sommités Fleuries',
        description: 'Exfoliation ultra-fine pour lisser la texture cutanée tout en douceur.',
        icon: 'grain',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      }
    ],
    usageTips: 'Mouillez votre savon pour faire naître une mousse onctueuse. Appliquez sur l\'ensemble du corps puis rincez. Déposez sur un support sec.',
    usageTipsEn: 'Wet the bar to release a velvety lather. Apply all over the body, then rinse. Place on a dry soap rest.',
    shippingInfo: 'Livraison offerte à partir de 50€. Expédié dans un colis éco-conçu zéro plastique.',
    shippingInfoEn: 'Complimentary shipping over 50€. Plastic-free eco parcel.',
    surgrasPercentage: '8%',
    scentProfile: 'Herbacé noble, note fleurie poudrée, terre fraîche',
    scentProfileEn: 'Noble herbal, powdery floral note, fresh morning earth',
    weight: '130g',
    featured: true,
    
    // Stocks & Seuil
    stock: 14,
    lowStockThreshold: 5,
    
    // Mentions GPSR
    inci: 'Sodium Olivate, Sodium Cocoate, Sodium Shea Butterate, Aqua, Glycerin, Papaver Somniferum (Poppy) Seed, Lavandula Hybrida Oil, Rosmarinus Officinalis Leaf Oil, Linalool*, Limonene*.',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-SIG00',
    pao: '18M'
  },
  {
    id: 'cedar-vetiver-oil',
    name: 'Cedar & Vetiver Body Oil',
    nameEn: 'Cedar & Vetiver Body Oil',
    tagline: 'Hydratation profonde aux notes boisées',
    taglineEn: 'Deep hydration with grounding notes',
    category: 'oils',
    price: 65.00,
    rating: 4.9,
    reviewCount: 22,
    tags: ['Cèdre', 'Vétiver', 'Huile Précieuse'],
    description: 'Hydratation profonde aux notes d\'ancrage. Un élixir doré régénérant formulé à partir d\'huiles vierges pressées à froid et de racines de vétiver.',
    descriptionEn: 'Deep restorative golden elixir formulated with cold-pressed botanical oils and rare vetiver roots.',
    longDescription: 'Véritable caresse satinée, cette huile corporelle sèche pénètre instantanément sans laisser de film gras. Les notes profondes de vétiver d\'Haïti et de cèdre rouge apportent calme mental et réconfort tout au long de la journée.',
    longDescriptionEn: 'A silky dry oil that sinks in immediately without greasiness. Earthy Haitian vetiver and red cedar bring grounding calm.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY2PerSYkBVuKzI6YdvsNTjV0ig4MKJzGYnc3e_7MnRs8nVc1iRIyhtWjAU1TI4xEJm2gLwQYCk6IvxbXCpotFPDzD1vn_v9XicyP7oopyPoJ31CazaglM51g8HmXCSuonbrZ7gv0Eq3EVpz2nTtnpzljYxPYLQZ_rRqKIM9Az6OenXhToV27UPUgxAFfQTlv-2ZlxtBGRE9HqVIcQXqFs0YNsn_cE_AgXh9zIDtZjDe-lbs5Wewwd'
    ],
    aspectRatio: 'square',
    ingredients: [
      {
        name: 'Huile de Jojoba Doré Bio',
        description: 'Régulatrice et semblable au sébum humain pour une pénétration instantanée.',
        icon: 'opacity',
        bgClass: 'bg-[#ffdbce]',
        iconClass: 'text-[#824f39]'
      },
      {
        name: 'Vétiver Racine Sauvage',
        description: 'Senteur fumée et terreuse favorisant la relaxation nerveuse et le sommeil.',
        icon: 'forest',
        bgClass: 'bg-[#e5e2da]',
        iconClass: 'text-[#5f5f58]'
      },
      {
        name: 'Huile de Carthame',
        description: 'Reconnue pour ses propriétés relipidantes et apaisantes pour les peaux matures.',
        icon: 'spa',
        bgClass: 'bg-[#d4e8d0]',
        iconClass: 'text-[#bb0a4a]'
      }
    ],
    usageTips: 'Appliquez quelques gouttes sur une peau encore légèrement humide après la douche ou le bain, massez en mouvements ascendants.',
    usageTipsEn: 'Apply a few drops on slightly damp skin after bath or shower, massage gently upward.',
    shippingInfo: 'Flacon en verre ambré avec réducteur en bois de hêtre durable.',
    shippingInfoEn: 'Amber glass bottle with sustainable beechwood dropper.',
    scentProfile: 'Boisé profond, sous-bois, ambre doux',
    scentProfileEn: 'Deep woody, earthy roots, sweet amber',
    weight: '100ml',
    featured: true,
    
    // Stocks & Seuil (Stock faible pour démonstration de l'alerte !)
    stock: 3,
    lowStockThreshold: 5,
    
    // Mentions GPSR
    inci: 'Simmondsia Chinensis (Jojoba) Seed Oil*, Carthamus Tinctorius (Safflower) Seed Oil*, Vetiveria Zizanoides (Vetiver) Root Oil, Cedrus Virginiana Wood Oil, Tocopherol (Vitamin E), Limonene*. (*issu de l agriculture biologique)',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-CVO05',
    pao: '12M'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'savon-signature',
    author: 'Claire T.',
    authorEmail: 'claire.t@example.com',
    rating: 5,
    comment: 'Le seul savon qui ne laisse pas ma peau sèche. L\'odeur est incroyablement apaisante, comme un vrai spa à la maison.',
    date: 'Il y a 2 jours',
    productName: 'Le Savon Signature',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'lavande-olive',
    author: 'Sophie M.',
    authorEmail: 'sophie.m@example.com',
    rating: 5,
    comment: 'La texture de la mousse est divinement douce. Un très beau produit qui dure longtemps. Je suis conquise.',
    date: 'Il y a 1 semaine',
    productName: 'Savon Lavande & Olive',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'eucalyptus-clay',
    author: 'Émilie R.',
    authorEmail: 'emilie.r@example.com',
    rating: 5,
    comment: 'Un véritable coup de fouet le matin sous la douche ! La peau est nette, fraîche et sans tiraillements.',
    date: 'Il y a 2 semaines',
    productName: 'Eucalyptus & French Clay',
    status: 'approved',
    verifiedPurchase: true
  }
];

export const REVIEWS = INITIAL_REVIEWS;

export const INITIAL_CART: { productId: string; quantity: number }[] = [
  { productId: 'eucalyptus-clay', quantity: 2 },
  { productId: 'cedar-vetiver-oil', quantity: 1 }
];
