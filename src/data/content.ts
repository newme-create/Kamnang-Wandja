import { Project, ServiceItem, StatItem, NewsItem, MilestoneSection, GalleryItem } from '../types';

export const MILESTONES: MilestoneSection[] = [
  { num: '01', label: 'ACCUEIL', targetId: 'accueil' },
  { num: '02', label: 'SERVICES', targetId: 'services' },
  { num: '03', label: 'RÉALISATIONS', targetId: 'realisations' },
  { num: '04', label: 'CHANTIERS', targetId: 'chantiers' },
  { num: '05', label: 'À PROPOS', targetId: 'a-propos' },
  { num: '06', label: 'ACTUALITÉS', targetId: 'actualites' },
  { num: '07', label: 'CONTACT', targetId: 'contact' },
];

export const STATS: StatItem[] = [
  {
    value: '15+',
    number: 15,
    suffix: '+',
    label: "ANS D'EXPÉRIENCE",
    description: 'Une solide expertise au service de vos projets',
    iconType: 'experience',
  },
  {
    value: '120+',
    number: 120,
    suffix: '+',
    label: 'PROJETS RÉALISÉS',
    description: 'Des projets variés livrés avec succès',
    iconType: 'projects',
  },
  {
    value: '45',
    number: 45,
    suffix: '',
    label: 'EXPERTS',
    description: 'Des professionnels qualifiés et passionnés',
    iconType: 'experts',
  },
  {
    value: '98%',
    number: 98,
    suffix: '%',
    label: 'CLIENTS SATISFAITS',
    description: 'Un engagement qualité reconnu par nos clients',
    iconType: 'satisfaction',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'construction',
    title: 'CONSTRUCTION',
    shortDesc: 'Bâtiments résidentiels, commerciaux et industriels clé en main.',
    fullDesc:
      'De la conception initiale à la livraison clé en main, nous concevons et bâtissons des complexes résidentiels de haut standing, des tours de bureaux modernes, des plateformes logistiques et des centres commerciaux aux normes internationales les plus exigeantes.',
    iconType: 'construction',
    highlights: [
      'Gros œuvre & Second œuvre intégré',
      'Immeubles R+10 et complexes mixtes',
      'Efficacité énergétique & normes HQE',
      'Pilotage et coordination des corps d’état (OPC)',
    ],
  },
  {
    id: 'genie-civil',
    title: 'GÉNIE CIVIL',
    shortDesc: 'Ouvrages d’art, fondations spéciales et structures complexes.',
    fullDesc:
      'Spécialistes des défis géotechniques et structurels majeurs, nous réalisons des ponts à haubans, des viaducs, des fondations profondes par pieux forés, des réservoirs hydrauliques et des structures en béton précontraint de grande portée.',
    iconType: 'genie-civil',
    highlights: [
      'Ponts, viaducs et échangeurs autoroutiers',
      'Fondations spéciales, parois moulées & micro-pieux',
      'Ouvrages maritimes et fluviaux',
      'Béton armé et précontraint haute performance',
    ],
  },
  {
    id: 'travaux-publics',
    title: 'TRAVAUX PUBLICS',
    shortDesc: 'Routes, ouvrages d’assainissement et aménagements urbains.',
    fullDesc:
      'Acteur de premier plan dans le désenclavement et l’aménagement territorial, BÂTIR PRO déploie ses parcs d’engins pour la construction d’axes routiers bitumés, de réseaux d’adduction d’eau potable, d’émissaires de drainage pluvial et d’aménagements urbains résilients.',
    iconType: 'travaux-publics',
    highlights: [
      'Terrassements massifs et plateformes industrielles',
      'Chaussées bitumineuses à fort trafic & rocades',
      'Réseaux d’assainissement et caniveaux primaires',
      'Éclairage public solaire et signalisation',
    ],
  },
  {
    id: 'renovation',
    title: 'RÉNOVATION',
    shortDesc: 'Rénovation et réhabilitation de bâtiments existants avec qualité.',
    fullDesc:
      'Nous redonnons vie aux patrimoines bâtis et modernisons les infrastructures vieillissantes. Nos équipes maîtrisent le renforcement de structures en béton armé, la réfection thermique, la requalification d’espaces tertiaires et la mise aux normes de sécurité incendie.',
    iconType: 'renovation',
    highlights: [
      'Renforcement structurel par fibre de carbone / chemisage',
      'Réhabilitation énergétique et façades ventilées',
      'Modernisation des réseaux fluides & électricité',
      'Surélévation et réaménagement d’espaces de travail',
    ],
  },
  {
    id: 'etudes',
    title: 'ÉTUDES ET CONCEPTION',
    shortDesc: 'BIM, calculs de structures et ingénierie environnementale avancée.',
    fullDesc:
      'Notre bureau d’études intégré utilise la modélisation BIM 3D/4D pour optimiser les coûts, anticiper les clashs techniques et garantir une exécution sans surprise sur le chantier.',
    iconType: 'etudes',
    highlights: ['Modélisation BIM Revit', 'Calculs Eurocodes & BAEL', 'Études d’impact environnemental'],
  },
  {
    id: 'gestion',
    title: 'GESTION DE PROJET',
    shortDesc: 'Assistance à maîtrise d’ouvrage et direction des travaux.',
    fullDesc:
      'Gestion rigoureuse des délais, du budget et de la conformité réglementaire pour sécuriser vos investissements immobiliers et d’infrastructures.',
    iconType: 'gestion',
    highlights: ['Contrôle qualité strict', 'Reporting hebdomadaire temps réel', 'Gestion des risques & HSE'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'pont-wouri',
    title: 'PONT SUR LA RIVIÈRE WOURI',
    category: 'GÉNIE CIVIL',
    year: '2022',
    metric: '320 MÈTRES',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop', // Illuminated bridge
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop', // Structural perspective
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop', // Aerial highway overpass
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1600&auto=format&fit=crop', // Cranes at sunset
    ],
    description:
      'Construction majeure d’un pont à haubans moderne au-dessus du fleuve Wouri, comprenant 4 voies de circulation, des voies piétonnes sécurisées et un éclairage architectural dynamique à LED.',
    location: 'Douala, Cameroun',
    client: 'Ministère des Travaux Publics / Communauté Urbaine',
    beforeAfter: {
      before: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1600&auto=format&fit=crop', // Raw construction ground
      after: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop', // Completed bridge
      beforeLabel: 'Site fluvial initial & fondations',
      afterLabel: 'Pont haubané achevé et illuminé',
    },
  },
  {
    id: 'tour-affaires',
    title: 'TOUR D’AFFAIRES AKWA SKYLINE',
    category: 'CONSTRUCTION',
    year: '2023',
    metric: '18 ÉTAGES • 24 000 M²',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop', // Modern glass tower
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop', // Architecture blueprint & construction
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop', // Premium interior lobby
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop', // Modern corporate floor
    ],
    description:
      'Immeuble de grande hauteur alliant bureaux d’affaires haut de gamme, centre de conférences et certification écologique BREEAM.',
    location: 'Douala - Akwa, Cameroun',
    client: 'Société Immobilière Centrale',
    beforeAfter: {
      before: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1600&auto=format&fit=crop', // Ground cranes
      after: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop', // Completed tower
      beforeLabel: 'Gros œuvre & radier béton',
      afterLabel: 'Façade double peau BREEAM',
    },
  },
  {
    id: 'echangeur-autoroute',
    title: 'ÉCHANGEUR DU CARREFOUR NORD',
    category: 'GÉNIE CIVIL',
    year: '2021',
    metric: '4 RAMPE • 1.8 KM',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop', // Highway interchange
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1600&auto=format&fit=crop', // Highway road landscape
      'https://images.unsplash.com/photo-1584463623578-30129a00a2be?q=80&w=1600&auto=format&fit=crop', // Civil asphalt paving
    ],
    description:
      'Ouvrage d’art d’envergure permettant de fluidifier l’accès nord de la métropole avec passages supérieurs en béton précontraint et aménagement paysager.',
    location: 'Yaoundé, Cameroun',
    client: 'Gouvernement & Partenaires Internationaux',
  },
  {
    id: 'complexe-logistique',
    title: 'PLATEFORME LOGISTIQUE PORTUAIRE',
    category: 'CONSTRUCTION',
    year: '2023',
    metric: '45 000 M² COUVERTS',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop', // Warehouse
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=1600&auto=format&fit=crop', // Steel framing
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1600&auto=format&fit=crop', // Industrial dock
    ],
    description:
      'Hub logistique multimodal ultra-moderne avec dallages industriels à haute résistance et système automatisé de gestion des flux.',
    location: 'Kribi, Cameroun',
    client: 'Consortium Portuaire Atlantique',
  },
  {
    id: 'hopital-regional',
    title: 'CENTRE HOSPITALIER UNIVERSITAIRE RÉGIONAL',
    category: 'CONSTRUCTION',
    year: '2022',
    metric: '250 LITS • 6 BLOCS',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop', // Hospital facade
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600&auto=format&fit=crop', // Medical modern interior
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop', // Hospital room
    ],
    description:
      'Complexe hospitalier d’urgence et d’hospitalisation doté d’équipements biomédicaux de pointe, d’une autonomie solaire et de salles blanches certifiées.',
    location: 'Bafoussam, Cameroun',
    client: 'Ministère de la Santé Publique',
  },
  {
    id: 'rocade-urbaine',
    title: 'ROCADE SUD & CORRIDOR ÉCO-RESPONSABLE',
    category: 'TRAVAUX PUBLICS',
    year: '2024',
    metric: '28 KM DE VOIE RAPIDE',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1600&auto=format&fit=crop', // Highway
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1600&auto=format&fit=crop', // Overpass
      'https://images.unsplash.com/photo-1584463623578-30129a00a2be?q=80&w=1600&auto=format&fit=crop', // Road paving asphalt
    ],
    description:
      'Axe stratégique désengorgeant le transit lourd urbain, avec traitement des eaux pluviales et plantation de 5 000 arbres le long des accotements.',
    location: 'Douala - Sud, Cameroun',
    client: 'Direction Générale des Infrastructures',
  },
];

// Rich gallery for the multi-column parallax construction showcase
export const FIELD_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Grue à Tour & Structure Béton Armé',
    category: 'GROS ŒUVRE',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop',
    location: 'Chantier Tour Akwa',
    tag: 'Levage Lourd 12T',
  },
  {
    id: 'g2',
    title: 'Coulage Radier & Béton Haute Résistance',
    category: 'BÉTON ARMÉ',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    location: 'Plateforme Industrielle',
    tag: 'Béton B50 Certifié',
  },
  {
    id: 'g3',
    title: 'Ouvrage d’Art Haubané & Tablier',
    category: 'OUVRAGES D’ART',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop',
    location: 'Franchissement Wouri',
    tag: 'Portée 320 Mètres',
  },
  {
    id: 'g4',
    title: 'Échangeur Autoroutier & Viaduc',
    category: 'GÉNIE CIVIL',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    location: 'Rocade Nord Yaoundé',
    tag: 'Poutres Précontraintes',
  },
  {
    id: 'g5',
    title: 'Application Enrobé Chaud & Finisseur Laser',
    category: 'VOIRIE & VRD',
    image: 'https://images.unsplash.com/photo-1584463623578-30129a00a2be?q=80&w=1200&auto=format&fit=crop',
    location: 'Axe Lourd Trans-National',
    tag: 'Guidage Laser Vögele',
  },
  {
    id: 'g6',
    title: 'Supervision & Topographie 3D sur Site',
    category: 'INGÉNIERIE',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    location: 'Port en Eau Profonde',
    tag: 'Contrôle Bureau Veritas',
  },
  {
    id: 'g7',
    title: 'Charpente Métallique Spatiale',
    category: 'CHARPENTE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    location: 'Hub Logistique Portuaire',
    tag: 'Portée Libre 60m',
  },
  {
    id: 'g8',
    title: 'Façade Vitrée Double Peau BREEAM',
    category: 'BÂTIMENT',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    location: 'Akwa Skyline R+18',
    tag: 'Isolation Thermique',
  },
  {
    id: 'g9',
    title: 'Forage Pieux Profonds & Géotechnique',
    category: 'GÉOTECHNIQUE',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
    location: 'Fondations Spéciales',
    tag: 'Foreuse Bauer BG28',
  },
];

export const NEWS: NewsItem[] = [
  {
    id: 'complexe-scolaire-nkolfisson',
    day: '15',
    monthYear: 'MAI 2024',
    title: 'LIVRAISON DU COMPLEXE SCOLAIRE DE NKOLFISSON',
    subtitle: 'Un nouvel espace moderne pour l’éducation et l’avenir de nos enfants.',
    fullContent:
      'BÂTIR PRO est fier d’annoncer la remise des clés du complexe éducatif d’excellence de Nkolfisson. Ce projet de 18 mois comprend 24 salles de classe bioclimatiques, une médiathèque numérique, un gymnase couvert et des installations sportives de haut niveau. L’établissement accueillera dès la prochaine rentrée plus de 1 200 élèves dans des conditions optimales d’apprentissage.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
    category: 'PROJET LIVRÉ',
    readTime: '3 min',
  },
  {
    id: 'rocade-douala',
    day: '02',
    monthYear: 'AVR. 2024',
    title: 'AVANCEMENT DES TRAVAUX DE LA ROCADE DE DOUALA',
    subtitle: 'Un projet structurant pour fluidifier la circulation et booster l’économie.',
    fullContent:
      'Le chantier de la nouvelle rocade de contournement franchit une étape décisive avec l’achèvement des terrassements du tronçon central et la pose des premières poutres du viaduc PK 12. Ce corridor routier permettra de réduire de 45% le temps de trajet pour les convois de marchandises et de sécuriser la mobilité quotidienne des riverains.',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1000&auto=format&fit=crop',
    category: 'INFRASTRUCTURE',
    readTime: '4 min',
  },
  {
    id: 'certification-iso',
    day: '10',
    monthYear: 'MARS 2024',
    title: 'BÂTIR PRO OBTIENT LA CERTIFICATION ISO 9001:2015',
    subtitle: 'Une reconnaissance de notre engagement qualité et de notre professionnalisme.',
    fullContent:
      'À la suite d’un audit exhaustif mené par l’organisme international Bureau Veritas, BÂTIR PRO a reçu le renouvellement sans réserve de sa certification ISO 9001:2015 pour l’ensemble de ses activités de construction et de génie civil. Cette distinction couronne nos efforts constants pour le zéro défaut, le respect scrupuleux des délais et l’amélioration continue.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    category: 'QUALITÉ & HSE',
    readTime: '2 min',
  },
];

