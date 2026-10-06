export interface Review { id: string; name: string; rating: number; date: string; text: string; isNew?: boolean; }
export const defaultReviews: Review[] = [
  {
    id: "1",
    name: "Mikhail",
    rating: 5,
    date: "24-mart, 2023",
    text: "Neplokhoe sochetanie tseny/kachestva. Administrator prekrasno govorit po russki. Ochen' lyubeznо pokazal gde mozhno pouzhinat' i predupredil v etom zavedenii vsekh chtoby vstrеtili khorosho. Nomer chistenkoi. Postel'noe bel'e samoe prostoe. Matras - porolon, no v principe norm. Vydayut mylo i shampun', est' odnorazovye tapki. V obshchem rekomenduyu kak mesto dlya perenochevat'.",
  },
  {
    id: "2",
    name: "Kostya Zyubin",
    rating: 3,
    date: "21-oktyabr', 2025",
    text: "Gostineca polnyy bardak vonaet v komnatakh sanuzеl tol'ko tarakany i vse slomana i von' uzhasnaya stoit a sam personal pri vide inostrantsa prosyat 3-kh tseny i klientam grubiyan",
  },
  {
    id: "3",
    name: "Konstantin Volkov",
    rating: 4,
    date: "15-iyulya, 2024",
    text: "Mylo i shampun' dali 'skreplya serdtsem', v vanne vonaet, shtorka otrvana, smesitel' sam zakryvaetsya (nuzhno derzhat' rukoy, chtoby prinyat' dush). Po telefonu - odna tsena za nomer, po faktu ona stanovitsya tsenoy za cheloveka.",
  },
];


