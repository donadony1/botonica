import { Product, Review } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'lavande-olive',
    name: 'Savon Lavande & Olive',
    tagline: 'Apaisant & Nourrissant',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 48,
    tags: ['Apaisant', 'Nourrissant', 'Surgras 8%'],
    description: 'Un rituel de purification doux, saponifié à froid. Enrichi en huile d\'olive vierge et délicatement parfumé aux huiles essentielles de lavande fine pour apaiser l\'esprit et la peau.',
    longDescription: 'Fabriqué à la main selon la méthode traditionnelle de saponification à froid, ce savon conserve naturellement toute sa glycérine végétale. Sa formule surgrasse à 8% nourrit intensément sans tiraillement, tandis que la lavande vraie de Haute-Provence diffuse ses notes florales relaxantes.',
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
    shippingInfo: 'Livraison standard (3-5 jours ouvrés) gratuite à partir de 50€ d\'achat. Retours acceptés dans un délai de 14 jours si le produit n\'a pas été utilisé et est dans son emballage d\'origine.',
    surgrasPercentage: '8%',
    scentProfile: 'Floral provençal, boisé délicat, herbacé doux',
    weight: '120g',
    featured: true
  },
  {
    id: 'eucalyptus-clay',
    name: 'Eucalyptus & French Clay',
    tagline: 'Purifying and clarifying',
    category: 'soaps',
    price: 24.00,
    rating: 4.9,
    reviewCount: 36,
    tags: ['Eucalyptus', 'Clay', 'Purifiant'],
    description: 'Cleansing ritual with gentle exfoliation. Purifying and clarifying soap formulated with French green clay and stimulating wild eucalyptus.',
    longDescription: 'Infusé d\'argile verte française ultra-ventilée et d\'huile essentielle d\'eucalyptus globulus bio, ce pain purifiant désincruste délicatement les pores sans assécher. Idéal pour revitaliser le corps après l\'effort ou pour réveiller les sens lors de la douche matinale.',
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
    shippingInfo: 'Expédition sous 24-48h. Emballage 100% recyclable sans plastique avec papier kraft compostable.',
    surgrasPercentage: '7%',
    scentProfile: 'Frais, camphré, herbacé purifiant',
    weight: '120g',
    featured: true
  },
  {
    id: 'wild-orange-cedar',
    name: 'Wild Orange & Cedar',
    tagline: 'Grounding and uplifting',
    category: 'soaps',
    price: 24.00,
    rating: 4.8,
    reviewCount: 29,
    tags: ['Wild Orange', 'Cedar', 'Energisant'],
    description: 'Grounding and uplifting. An invigorating blend of sweet wild orange peel and warm Atlas cedarwood notes.',
    longDescription: 'Ce savon terracotta chaud célèbre les vergers ensoleillés et les forêts d\'altitude. Parfumé à l\'orange douce de Sicile et au bois de cèdre de l\'Atlas, il réchauffe l\'atmosphère du bain et redonne vitalité aux peaux fatiguées.',
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
    shippingInfo: 'Livraison neutre en carbone. Satisfait ou remboursé sous 14 jours.',
    surgrasPercentage: '8%',
    scentProfile: 'Agrumes chaleureux, bois de cèdre, ambre subtil',
    weight: '120g',
    featured: true
  },
  {
    id: 'oat-milk-honey',
    name: 'Oat Milk & Honey',
    tagline: 'Nourishing and soothing',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 52,
    tags: ['Oat Milk', 'Honey', 'Hypoallergénique'],
    description: 'Nourishing and soothing. Ultra-gentle formula crafted for sensitive and delicate skin with organic oat milk and raw wildflower honey.',
    longDescription: 'Conçu sans parfum ajouté pour respecter les épidermes les plus réactifs, ce pain d\'une douceur infinie allie le lait d\'avoine colloidal apaisant au miel brut récolté localement. Il laisse un voile protecteur velouté sur la peau.',
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
    shippingInfo: 'Emballé dans un étui en papier de graines ensemencées prêt à planter.',
    surgrasPercentage: '9%',
    scentProfile: 'Naturel, gourmandise subtile d\'avoine et de miel tiède',
    weight: '120g',
    featured: true
  },
  {
    id: 'savon-signature',
    name: 'Le Savon Signature',
    tagline: 'L\'icône Ndolo au marbre végétal',
    category: 'soaps',
    price: 24.00,
    rating: 5.0,
    reviewCount: 64,
    tags: ['Signature', 'Surgras 8%', '100% Naturel'],
    description: 'Transformez votre douche en rituel. Notre savon signature allie des ingrédients bruts d\'exception pour une expérience sensorielle inégalée.',
    longDescription: 'Pièce maîtresse de la maison Ndolo, ce savon marbré aux reflets sauge et écru associe les vertus de la lavande séchée, des huiles nobles et d\'un surgras protecteur de 8%. Chaque pièce est découpée et estampillée à la main dans notre atelier provençal.',
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
    shippingInfo: 'Livraison offerte à partir de 50€. Expédié dans un colis éco-conçu zéro plastique.',
    surgrasPercentage: '8%',
    scentProfile: 'Herbacé noble, note fleurie poudrée, terre fraîche',
    weight: '130g',
    featured: true
  },
  {
    id: 'cedar-vetiver-oil',
    name: 'Cedar & Vetiver Body Oil',
    tagline: 'Deep hydration with grounding notes',
    category: 'oils',
    price: 65.00,
    rating: 4.9,
    reviewCount: 22,
    tags: ['Cedar', 'Vetiver', 'Huile Précieuse'],
    description: 'Deep hydration with grounding notes. A restorative golden elixir formulated with cold-pressed Ndolol seed oils and rare vetiver roots.',
    longDescription: 'Véritable caresse satinée, cette huile corporelle sèche pénètre instantanément sans laisser de film gras. Les notes profondes de vétiver d\'Haïti et de cèdre rouge apportent calme mental et réconfort tout au long de la journée.',
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
    shippingInfo: 'Flacon en verre ambré avec réducteur en bois de hêtre durable.',
    scentProfile: 'Boisé profond, sous-bois, ambre doux',
    weight: '100ml',
    featured: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Claire T.',
    rating: 5,
    comment: 'Le seul savon qui ne laisse pas ma peau sèche. L\'odeur est incroyablement apaisante, comme un vrai spa à la maison.',
    date: 'Il y a 2 jours',
    productName: 'Le Savon Signature'
  },
  {
    id: 'rev-2',
    author: 'Sophie M.',
    rating: 5,
    comment: 'La texture de la mousse est divinement douce. Un très beau produit qui dure longtemps. Je suis conquise.',
    date: 'Il y a 1 semaine',
    productName: 'Savon Lavande & Olive'
  },
  {
    id: 'rev-3',
    author: 'Émilie R.',
    rating: 4.5,
    comment: 'Un véritable objet de décoration dans la salle de bain, mais surtout un soin complet. Mon rituel du soir préféré.',
    date: 'Il y a 2 semaines',
    productName: 'Eucalyptus & French Clay'
  }
];

export const INITIAL_CART: { productId: string; quantity: number }[] = [
  { productId: 'eucalyptus-clay', quantity: 2 },
  { productId: 'cedar-vetiver-oil', quantity: 1 }
];
