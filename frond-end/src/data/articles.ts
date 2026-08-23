import { Article } from '../types';

export const ARTICLES: Article[] = [
  {
    id: 'secrets-savon-noir-africain',
    slug: 'secrets-savon-noir-africain',
    title: "Les Secrets Ancestraux du Savon Noir Africain : Origines, Bienfaits et Rituel d'Utilisation",
    titleEn: 'Ancestral Secrets of African Black Soap: Origins, Benefits, and Daily Ritual',
    excerpt: "Découvrez l'histoire fascinante du véritable savon noir artisanal, sa composition 100% brute et la méthode idéale pour révéler l'éclat naturel de votre peau sans la dessécher.",
    excerptEn: 'Discover the fascinating story of authentic raw black soap, its 100% natural ingredients, and the optimal ritual to reveal glowing skin.',
    content: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Depuis des siècles en Afrique de l'Ouest et Centrale, les femmes élaborent à la main un soin purifiant d'une puissance végétale inégalée : le véritable Savon Noir. Loin des cosmétiques industriels surchargés en agents synthétiques, ce trésor brut perpétue une alchimie simple et bienveillante entre la terre et l'eau.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Une Saponification 100% Végétale et Naturelle</h2>
      <p class="mb-4 leading-relaxed">
        Contrairement aux savons modernes qui utilisent de la soude caustique industrielle (hydroxyde de sodium), le savon noir traditionnel est saponifié exclusivement à partir de <strong>cendres végétales</strong> (notamment de peaux de bananes plantains et de cabosses de cacao grillées). Ces cendres riches en potassium naturel interagissent avec les huiles végétales pures et le beurre de karité pour créer un savon ultra-doux, naturellement surgras et protecteur.
      </p>

      <blockquote class="my-8 p-6 bg-[#E6D5C3]/30 border-l-4 border-[#3D2B1F] rounded-r-2xl italic font-serif text-lg text-[#26170c]">
        « En langue Duala, "Ndolo" signifie amour. C'est cet amour profond pour la pureté originelle qui guide chaque étape de notre fabrication artisanale. »
      </blockquote>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Pourquoi Votre Peau Va l'Adorer</h2>
      <ul class="space-y-3 mb-6 list-disc pl-6 text-[#4f453f]">
        <li><strong>Nettoyage en profondeur des pores :</strong> Élimine l'excès de sébum, les impuretés et la pollution sans détruire la barrière cutanée.</li>
        <li><strong>Micro-exfoliation enzymatique :</strong> La présence naturelle de fines particules de cendres favorise le renouvellement cellulaire et prévient les poils incarnés.</li>
        <li><strong>Action apaisante immédiate :</strong> Les vitamines A et E contenues dans le karité brut calment les rougeurs et réduisent l'inconfort cutané.</li>
      </ul>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Le Rituel Pas à Pas</h2>
      <p class="mb-4 leading-relaxed">
        Pour profiter pleinement de ses vertus, faites mousser le savon entre vos paumes humides avec un filet d'eau tiède. Massez délicatement le visage ou le corps en mouvements circulaires pendant 45 à 60 secondes, puis rincez abondamment à l'eau fraîche pour resserrer les pores. Terminez en appliquant quelques gouttes d'huile végétale pure sur peau encore légèrement humide.
      </p>
    `,
    contentEn: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        For centuries across West and Central Africa, women have handcrafted a botanical skin cleanser of unmatched purity: authentic raw Black Soap. Free from harsh chemicals, it preserves ancestral alchemy between plant nutrients and clean water.
      </p>
      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">100% Plant-Based Saponification</h2>
      <p class="mb-4 leading-relaxed">
        Unlike modern industrial soaps made with synthetic soda, ancestral black soap is crafted exclusively using roasted plantain skin and cocoa pod ashes. Rich in natural potassium, these ashes saponify pure shea butter and nourishing oils into a rich, superfatted cleansing bar.
      </p>
      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">The Step-by-Step Ritual</h2>
      <p class="mb-4 leading-relaxed">
        Lather between damp hands, massage gently on face and body in circular motions for 60 seconds, then rinse with fresh water. Lock in hydration with a few drops of precious botanical oil.
      </p>
    `,
    category: 'culture',
    categoryLabel: 'Culture & Savoir-Faire',
    categoryLabelEn: 'Culture & Craft',
    author: 'Karene Bella',
    authorRole: 'Fondatrice & Formulatrice Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedAt: '22 Août 2026',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzYo9pIi0DtyG0IpLMPOPOLdTTp_IFTvNQo7KE4UZEwFnQQTEfHxYs9-XxrAl0hsEXc45_wE5WAysIaboHJax-ynjGqiru30UDHJFqOUEb2oV3mwFwpXy3n2ZDcaNEWH0parFyb_3mhdZ93-86LYH-dwbRFsWikxCdkUpJfjtNp_Fscqa8RabYwGJTXoYQlCqTxhgPzblaDZCMZ-HPvex8HCJzVlBViESpi0dfY7HUVnv8jxp8Fk4JsuKycAzQ8rh-A',
    tags: ['Savon Noir', 'Rituel Ancestral', 'Saponification', 'Soins Naturels'],
    featured: true,
    relatedProductIds: ['savon-signature', 'lavande-olive'],
  },
  {
    id: 'apaiser-acne-eczema-hyperpigmentation',
    slug: 'apaiser-acne-eczema-hyperpigmentation',
    title: 'Acné, Eczéma et Hyperpigmentation : Comment Calmer l’Inflammation Naturellement',
    titleEn: 'Acne, Eczema & Dark Spots: How to Naturally Calm Inflammation',
    excerpt: "Comprendre les mécanismes de l'inflammation cutanée et adopter une routine minimaliste pour apaiser les peaux sensibles, réactives et sujettes aux taches pigmentaires.",
    excerptEn: 'Understand skin inflammation mechanisms and build a minimalist routine to soothe sensitive and blemish-prone skin.',
    content: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Face aux imperfections récurrentes ou aux rougeurs persistantes, le réflexe habituel consiste souvent à multiplier les actifs décapants (acides agressifs, exfoliants mécaniques abrasifs). Pourtant, la clé d'un teint équilibré réside dans le renforcement bienveillant de la barrière protectrice de votre peau.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">1. Réguler le Sébum sans Décaper</h2>
      <p class="mb-4 leading-relaxed">
        Lorsqu'une peau acnéique est agressée par des tensioactifs sulfatés, elle surproduit du sébum par effet rebond pour se défendre. Le savon noir brut enrichi en beurre de karité purifie en douceur tout en déposant des lipides protecteurs qui signalent aux glandes sébacées de se stabiliser.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">2. Atténuer l’Hyperpigmentation Post-Inflammatoire</h2>
      <p class="mb-4 leading-relaxed">
        Les taches sombres qui surviennent après un bouton ou une irritation sont causées par une surproduction de mélanine en réponse à l'inflammation. Grâce aux polyphénols antioxydants du <strong>cacao brut</strong> et à la richesse en vitamine A du <strong>karité non raffiné</strong>, le renouvellement cellulaire est stimulé naturellement, atténuant progressivement les marques sans risque de dépigmentation.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">3. Les Gestes Essentiels au Quotidien</h2>
      <ul class="space-y-3 mb-6 list-disc pl-6 text-[#4f453f]">
        <li>Ne lavez jamais votre visage à l'eau trop chaude, qui dilate les capillaires et accentue les rougeurs.</li>
        <li>Évitez de frotter avec une serviette rugueuse : séchez votre visage par légers tapotements.</li>
        <li>Hydratez immédiatement avec une huile protectrice (comme l'huile de jojoba ou le macérât de calendula).</li>
      </ul>
    `,
    contentEn: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        When facing recurring blemishes or sensitivity, the common mistake is over-exfoliating. True balance comes from gently restoring the skin's moisture barrier.
      </p>
      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Balancing Sebum Without Stripping</h2>
      <p class="mb-4 leading-relaxed">
        Raw African black soap combined with unrefined shea butter purifies pores while preserving essential barrier lipids.
      </p>
    `,
    category: 'skin-health',
    categoryLabel: 'Santé de la Peau',
    categoryLabelEn: 'Skin Health',
    author: 'Dr. Amina Touré',
    authorRole: 'Consultante en Dermatologie Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    publishedAt: '18 Août 2026',
    readTime: '5 min de lecture',
    readTimeEn: '5 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABRhmuuGic8OWruUtIrsv0wBxFwRR5T_o53BkSPP2R9mc0yrg2WfSD1bzBrjnTId91Oqky77HS9_faq9WiGO_qubjx280VvLumBXwmeovrKoEu-77t6jPviLlbLaGwIL7urIBVat9VS_HgWSt43cZZmHenKzTcsc9AEYTNys2X-aDqrPxMlIURbhlrXy27wTH7j3hLWf3Wz9MTYK746jDtsvmVMhQRZqeAazZQWwYURfYEFu1QAIrvCn73MPDbgzpQQQ',
    tags: ['Acné', 'Eczéma', 'Hyperpigmentation', 'Peaux Sensibles'],
    featured: false,
    relatedProductIds: ['savon-signature', 'eucalyptus-clay'],
  },
  {
    id: 'beurre-de-karite-brut-or-vegetal',
    slug: 'beurre-de-karite-brut-or-vegetal',
    title: 'Le Beurre de Karité Brut : Pourquoi la Qualité Non Raffinée Change Tout',
    titleEn: 'Raw Unrefined Shea Butter: Why Unprocessed Quality Changes Everything',
    excerpt: "Plongez dans les vertus exceptionnelles du karité artisanal pressé à froid. Découvrez comment reconnaître un beurre véritablement actif et riche en vitamines réparatrices.",
    excerptEn: 'Dive into the exceptional benefits of artisanal raw shea butter and how to identify true unrefined quality.',
    content: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Surnommé « l'or des femmes » dans les savanes d'Afrique subsaharienne, le beurre de karité est l'un des émollients naturels les plus complets au monde. Mais attention : tous les beurres de karité ne se valent pas.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Brut vs Raffiné : La Différence Cruciale</h2>
      <p class="mb-4 leading-relaxed">
        Le beurre de karité blanc et inodore vendu en grande surface a généralement subi un raffinage industriel à haute température, souvent avec des solvants chimiques (hexane). Ce processus élimine jusqu'à 85% de ses principes actifs (acides gras essentiels, cinnamates protecteurs et phytostérols).
      </p>
      <p class="mb-4 leading-relaxed">
        À l'inverse, le karité <strong>brut et non raffiné</strong> conserve sa teinte ivoire ou jaune naturelle, son subtil parfum végétal de noisette et l'intégralité de ses vitamines A, E et F hautement cicatrisantes.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">Un Bouclier Naturel Contre la Déshydratation</h2>
      <p class="mb-4 leading-relaxed">
        Grâce à sa haute concentration en esters cinnamiques et en karitène, le beurre brut forme un film perméable à l'air qui retient l'eau dans les couches supérieures de l'épiderme tout en protégeant la peau des agressions climatiques (vent, froid, soleil).
      </p>
    `,
    contentEn: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Revered as women's gold across West Africa, raw shea butter is one of nature's most complete healing emollients.
      </p>
    `,
    category: 'ingredients',
    categoryLabel: 'Ingrédients Purs',
    categoryLabelEn: 'Pure Ingredients',
    author: 'Karene Bella',
    authorRole: 'Fondatrice & Formulatrice Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedAt: '12 Août 2026',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    image: 'https://images.unsplash.com/photo-1608248597359-59754f9a0c10?w=800&auto=format&fit=crop&q=80',
    tags: ['Karité Brut', 'Nutrition Intense', 'Ingrédients Purs'],
    featured: false,
    relatedProductIds: ['cedar-vetiver-oil', 'savon-signature'],
  },
  {
    id: 'rituel-du-bain-vesperal-saponification-a-froid',
    slug: 'rituel-du-bain-vesperal-saponification-a-froid',
    title: 'Le Rituel du Bain Vespéral : Pourquoi la Saponification à Froid Transforme Votre Peau',
    titleEn: 'The Evening Bath Ritual: Why Cold Saponification Transforms Your Skin',
    excerpt: "Comment transformer votre douche du soir en un véritable moment de méditation et de régénération cutanée grâce aux huiles botaniques et au surgras bienfaisant.",
    excerptEn: 'Transform your evening shower into a mindful regeneration ritual with cold-process botanical soaps.',
    content: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Le soir, votre peau a accumulé des milliers de micro-particules de pollution, des traces de transpiration et le stress oxydatif de la journée. Le bain vespéral n'est pas un simple geste d'hygiène : c'est un sas de décompression pour le corps et l'esprit.
      </p>

      <h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4">La Magie de la Glycérine Végétale Naturelle</h2>
      <p class="mb-4 leading-relaxed">
        Dans les gels douche industriels, la glycérine est souvent retirée pour être revendue à d'autres industries. Dans nos savons artisanaux saponifiés lentement, toute la glycérine végétale reste au cœur du pain de savon, apportant une hydratation instantanée dès la première minute de contact avec l'eau.
      </p>
    `,
    contentEn: `
      <p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">
        Evening skincare is a moment of deep release for body and mind after a long day.
      </p>
    `,
    category: 'rituals',
    categoryLabel: 'Rituels de Bain',
    categoryLabelEn: 'Bath Rituals',
    author: 'Elise Laurent',
    authorRole: 'Naturopathe & Aromathérapeute',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    publishedAt: '05 Août 2026',
    readTime: '3 min de lecture',
    readTimeEn: '3 min read',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    tags: ['Bain Vespéral', 'Détente', 'Surgras', 'Aromathérapie'],
    featured: false,
    relatedProductIds: ['lavande-olive', 'cedar-vetiver-oil'],
  },
];
