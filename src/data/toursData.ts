import { TourPackage, TourStop } from '../types';

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'daimler-haupttour',
    title: 'Auf den Spuren von Gottlieb Daimler',
    tagline: 'Die beliebte historische Kostümführung im originalgetreuen Gewand des 19. Jahrhunderts',
    badge: 'Empfehlung & Publikumsliebling',
    duration: 'ca. 1,5 – 2 Stunden',
    groupSize: 'Bis zu 25 Personen je Gruppe (größere Gruppen auf Anfrage)',
    meetingPoint: 'Rathaus am Marktplatz 1, 73614 Schorndorf (oder nach Absprache)',
    priceNote: 'Attraktive Gruppen- & Pauschalpreise auf Anfrage',
    description:
      'Erleben Sie Schorndorf durch die Augen seines berühmtesten Sohnes! Walter Leppert schlüpft authentisch in die Rolle von Gottlieb Daimler (1834–1900). Mit Frack, Zylinder und schwäbischem Witz führt er Sie durch die verwinkelten Gassen seiner Kindheit. Erfahren Sie, wie aus dem Bäckerbub aus der Höllgasse der Pionier wurde, der die Welt mobil machte.',
    features: [
      'Kostümführung als Gottlieb Daimler persönlich',
      'Außenbesichtigung & Geschichte des Geburtshauses in der Höllgasse',
      'Lebendige Anekdoten zu Daimlers Lehrjahren, Erfolgen & Visionen',
      'Spannende Einblicke in das Schorndorfer Leben des 19. Jahrhunderts',
      'Für Jung & Alt, Familien, Vereine, Schulklassen und Fachpublikum'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    highlight: true,
  },
  {
    id: 'daimler-kompakt',
    title: 'Kompaktführung am Geburtshaus',
    tagline: 'Die ideale Einstiegstour rund um Höllgasse & Daimler-Museum',
    badge: 'Kompakt & Informativ',
    duration: 'ca. 45 – 60 Minuten',
    groupSize: 'Individuelle Gruppengrößen',
    meetingPoint: 'Gottlieb-Daimler-Geburtshaus, Höllgasse 7',
    priceNote: 'Kompakter Pauschaltarif für Kurzentschlossene',
    description:
      'Wenig Zeit, aber große Neugier? Die Kompaktführung konzentriert sich auf das Herzstück: das Geburtshaus in der malerischen Höllgasse. Hören Sie die spannendsten Kurzgeschichten über Daimlers erste Experimente, seine familiären Wurzeln und den Weg zur legendären Werkstatt in Cannstatt.',
    features: [
      'Fokus auf Höllgasse & Geburtshaus-Historie',
      'Perfekt für eilige Reisegruppen oder straffe Ausflugspläne',
      'Anschauliche Geschichten über die Bäckersfamilie Daimler',
      'Ideal kombinierbar mit anschließender Einkehr in Schorndorf'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'firmen-und-events',
    title: 'Daimler Erlebnistour für Gruppen & Firmen',
    tagline: 'Maßgeschneiderte Führungen für Betriebsausflüge, Geburtstage & Jubiläen',
    badge: 'Individuell planbar',
    duration: 'Flexibel nach Absprache (1,5 bis 3 Stunden)',
    groupSize: 'Für jede Gruppengröße planbar',
    meetingPoint: 'Wunschtreffpunkt in Schorndorf (z.B. Bahnhof, Hotel oder Lokal)',
    priceNote: 'Individuelles Angebot inklusive Sonderwünschen',
    description:
      'Sie planen einen Firmenausflug, einen runden Geburtstag, ein Klassentreffen oder ein Event für Ihren Verein? Walter Leppert gestaltet Ihre Führung ganz persönlich. Auf Wunsch mit Sekt- oder Brezelstopp, Fotogelegenheiten im historischen Gewand und Insidertipps für die anschließende Gastronomie im Remstal.',
    features: [
      'Individuelle Anpassung von Route, Dauer und Themenschwerpunkten',
      'Fotopausen mit Stadtführer Walter Leppert im historischen Kostüm',
      'Organisationsunterstützung für Sektempfang oder Gasthaus-Reservierung',
      'Hoher Unterhaltungswert mit viel Humor und schwäbischem Charme'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fachwerk-und-stadtgeschichte',
    title: 'Schorndorfer Altstadt & Fachwerkromantik',
    tagline: 'Die historische Residenzstadt, die Daimler prägte, und die Weiber von Schorndorf',
    badge: 'Kultur & Architektur',
    duration: 'ca. 1,5 Stunden',
    groupSize: 'Bis zu 25 Personen',
    meetingPoint: 'Historischer Marktplatz Schorndorf',
    priceNote: 'Attraktive Gruppenkonditionen',
    description:
      'Schorndorf zählt zu den prächtigsten Fachwerkstädten an der Deutschen Fachwerkstraße. Tauchen Sie ein in die wechselvolle Stadtgeschichte: Vom Mittelalter über die mutigen Schorndorfer Weiber im Jahr 1688 bis hin zum Aufstieg der Handwerkskünste, die den Nährboden für Gottlieb Daimlers Tüftlergeist bildeten.',
    features: [
      'Entdeckung der historischen Fachwerk-Fassaden und Winkel',
      'Die spannende Geschichte der Schorndorfer Weiberwehr von 1688',
      'Architekturjuwelen rund um den prächtigen Marktplatz',
      'Begegnung mit der schwäbischen Tüftler- und Handwerkstradition'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1200&q=80',
  }
];

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'stop-1',
    number: 1,
    title: 'Historisches Rathaus & Marktplatz',
    subtitle: 'Das barocke Herz der Stadt Schorndorf',
    address: 'Marktplatz 1, 73614 Schorndorf',
    description:
      'Der Marktplatz mit seinem 1726–1730 erbauten Rathaus und dem Marktbrunnen bildet den repräsentativen Auftakt. Hier schlug das bürgerliche Herz der Stadt, in der Gottlieb Daimler aufwuchs.',
    historicalFact:
      'Daimlers Vater Johannes betrieb unweit des Marktplatzes eine angesehene Bäckerei und Gastwirtschaft. Schon damals war der Platz Umschlagplatz für Neuigkeiten und Innovationen.',
  },
  {
    id: 'stop-2',
    number: 2,
    title: 'Gottlieb-Daimler-Geburtshaus',
    subtitle: 'Wo am 17. März 1834 die Mobilität ihren Ursprung nahm',
    address: 'Höllgasse 7, 73614 Schorndorf',
    description:
      'Das malerische Fachwerkhaus in der schmalen Höllgasse ist das authentische Elternhaus Daimlers. Heute befindet sich hier die Gedächtnisstätte der Mercedes-Benz AG mit Zeichnungen, Dokumenten und persönlichen Gegenständen.',
    historicalFact:
      'Gottlieb wurde als zweiter Sohn des Bäckermeisters Johannes Deumler (später Daimler) geboren. Hier im Haus roch es nach frischem Brot und schwäbischem Fleiß.',
  },
  {
    id: 'stop-3',
    number: 3,
    title: 'Evangelische Stadtkirche',
    subtitle: 'Ort der Taufe & Konfirmation',
    address: 'Kirchplatz, 73614 Schorndorf',
    description:
      'Die spätgotische Stadtkirche ragt majestätisch über die Dächer der Altstadt. Hier wurde der junge Gottlieb am 18. März 1834 getauft und später konfirmiert.',
    historicalFact:
      'Die Kirchenbücher halten die Abstammung der Familie Daimler über viele Generationen hinweg sorgsam fest.',
  },
  {
    id: 'stop-4',
    number: 4,
    title: 'Ehemalige Lateinschule',
    subtitle: 'Talentschmiede für Geometrie und Zeichnen',
    address: 'Kirchplatz / Schulstraße',
    description:
      'In der städtischen Lateinschule und der sonntäglichen Zeichenschule erkannte sein Zeichenlehrer Ferdinand von Steinbeis das außergewöhnliche technische Talent des jungen Gottlieb.',
    historicalFact:
      'Steinbeis förderte Daimler maßgeblich und vermittelte ihm später ein Stipendium an der Königlichen Polytechnischen Schule in Stuttgart.',
  },
  {
    id: 'stop-5',
    number: 5,
    title: 'Daimler-Denkmal & Stadtgarten',
    subtitle: 'Gedenken an den genialen Konstrukteur',
    address: 'Stadtgarten Schorndorf',
    description:
      'Das bronzene Denkmal ehrt Gottlieb Daimler als Schöpfer des leichten Schnellläufer-Benzinmotors, des ersten vierrädrigen Automobils und des ersten Motorrads („Reitwagen“ 1885).',
    historicalFact:
      'Daimlers Lebensmotto lautete: „Das Beste oder nichts.“ Dieser Geist spiegelt sich auch in Walter Lepperts Führungen wider.',
  },
  {
    id: 'stop-6',
    number: 6,
    title: 'Gerberviertel an den Stadtmauern',
    subtitle: 'Handwerkskunst und historische Wasserwege',
    address: 'Gerberstraße / Remsufer',
    description:
      'Das romantische Viertel mit seinen hölzernen Gerberlauben zeigt das alte Schorndorfer Handwerk und die Verbindung der Stadt zu ihren Ressourcen.',
    historicalFact:
      'Präzision und handwerkliches Können waren in Württemberg stets tief verwurzelt – die Grundlage für die industrielle Revolution im Südwesten.',
  }
];
