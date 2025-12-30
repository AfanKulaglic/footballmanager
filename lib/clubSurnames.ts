// Default surnames by club ID - predefined surnames for each club
// Each club has UNIQUE surnames that don't repeat across teams

// English Premier League clubs (101-120) - unique surnames per club
export const defaultClubSurnames: Record<number, string[]> = {
  // Manchester City
  101: ["Haaland", "De Bruyne", "Foden", "Rodri", "Dias", "Walker", "Stones", "Grealish", "Bernardo", "Ederson", "Akanji", "Ake", "Gundogan", "Alvarez", "Doku", "Lewis", "Kovacic", "Nunes", "Bobb", "Wilson-Esbrand"],
  // Arsenal
  102: ["Saka", "Odegaard", "Martinelli", "Rice", "Saliba", "Gabriel", "White", "Zinchenko", "Ramsdale", "Havertz", "Trossard", "Timber", "Jorginho", "Partey", "Nketiah", "Jesus", "Tomiyasu", "Kiwior", "Nelson", "Smith Rowe"],
  // Liverpool
  103: ["Salah", "Nunez", "Diaz", "Szoboszlai", "Mac Allister", "Gravenberch", "Van Dijk", "Konate", "Alexander-Arnold", "Robertson", "Alisson", "Gakpo", "Elliott", "Jones", "Endo", "Gomez", "Quansah", "Bradley", "Kelleher", "Morton"],
  // Manchester United
  104: ["Rashford", "Fernandes", "Hojlund", "Garnacho", "Mainoo", "Casemiro", "Martinez", "Varane", "Shaw", "Dalot", "Onana", "Antony", "Mount", "Eriksen", "McTominay", "Amrabat", "Maguire", "Evans", "Malacia", "Diallo"],
  // Chelsea
  105: ["Palmer", "Jackson", "Mudryk", "Caicedo", "Colwill", "Thiago Silva", "Chilwell", "James", "Sanchez", "Gallagher", "Nkunku", "Madueke", "Gusto", "Disasi", "Badiashile", "Cucurella", "Chalobah", "Petrovic", "Dewsbury-Hall", "Neto"],
  // Tottenham
  106: ["Son", "Maddison", "Richarlison", "Johnson", "Bissouma", "Sarr", "Romero", "Van de Ven", "Udogie", "Porro", "Vicario", "Kulusevski", "Bentancur", "Werner", "Solomon", "Emerson", "Davies", "Skipp", "Sessegnon", "Gil"],
  // Newcastle
  107: ["Isak", "Gordon", "Guimaraes", "Joelinton", "Tonali", "Longstaff", "Botman", "Schar", "Trippier", "Hall", "Pope", "Barnes", "Almiron", "Murphy", "Willock", "Burn", "Lascelles", "Krafth", "Anderson", "Miley"],
  // Aston Villa
  108: ["Watkins", "Bailey", "McGinn", "Douglas Luiz", "Tielemans", "Kamara", "Torres", "Konsa", "Digne", "Cash", "Martinez", "Diaby", "Ramsey", "Buendia", "Dendoncker", "Mings", "Chambers", "Maatsen", "Duran", "Zaniolo"],
  // Brighton
  109: ["Mitoma", "March", "Welbeck", "Gross", "Gilmour", "Dunk", "Webster", "Estupinan", "Veltman", "Steele", "Ferguson", "Enciso", "Adingra", "Buonanotte", "Baleba", "Dahoud", "Lamptey", "Milner", "Hinshelwood", "Ayari"],
  // West Ham
  110: ["Bowen", "Kudus", "Paqueta", "Ward-Prowse", "Soucek", "Zouma", "Aguerd", "Coufal", "Fabianski", "Antonio", "Ings", "Benrahma", "Mavropanos", "Ogbonna", "Cresswell", "Earthy", "Summerville", "Fullkrug", "Kilman", "Todibo"],
  // Crystal Palace
  111: ["Eze", "Olise", "Mateta", "Edouard", "Lerma", "Doucoure", "Guehi", "Andersen", "Mitchell", "Munoz", "Henderson", "Ayew", "Schlupp", "Hughes", "Clyne", "Ward", "Richards", "Riedewald", "Wharton", "Sarr"],
  // Fulham
  112: ["Jimenez", "Iwobi", "Pereira", "Willian", "Palhinha", "Reed", "Tosin", "Ream", "Robinson", "Tete", "Leno", "Muniz", "Wilson", "Cairney", "Lukic", "Diop", "Bassey", "Castagne", "Smith", "Traore"],
  // Wolves
  113: ["Cunha", "Hwang", "Sarabia", "Lemina", "Dawson", "Ait-Nouri", "Semedo", "Sa", "Guedes", "Podence", "Gomes", "Bueno", "Toti", "Mosquera", "Doyle", "Hodge", "Bellegarde", "Strand Larsen", "Forbs", "Doherty"],
  // Bournemouth
  114: ["Solanke", "Semenyo", "Kluivert", "Christie", "Cook", "Scott", "Senesi", "Zabarnyi", "Kerkez", "Neto", "Tavernier", "Ouattara", "Billing", "Brooks", "Mepham", "Kelly", "Sinisterra", "Aarons", "Unal", "Adams"],
  // Brentford
  115: ["Mbeumo", "Toney", "Wissa", "Damsgaard", "Norgaard", "Janelt", "Collins", "Pinnock", "Henry", "Ajer", "Flekken", "Schade", "Onyeka", "Jensen", "Roerslev", "Mee", "Lewis-Potter", "Yarmoliuk", "Carvalho", "Konak"],
  // Everton
  116: ["Calvert-Lewin", "McNeil", "Harrison", "Gueye", "Tarkowski", "Branthwaite", "Mykolenko", "Patterson", "Pickford", "Beto", "Garner", "Iroegbunam", "Godfrey", "Keane", "Holgate", "Young", "Lindstrom", "Chermiti", "Mangala", "Ndiaye"],
  // Nottingham Forest
  117: ["Wood", "Elanga", "Gibbs-White", "Hudson-Odoi", "Yates", "Sangare", "Murillo", "Boly", "Williams", "Aina", "Turner", "Awoniyi", "Danilo", "Dominguez", "Kouyate", "Worrall", "Toffolo", "Montiel", "Sosa", "Morato"],
  // Leicester
  118: ["Vardy", "Fatawu", "Mavididi", "Ndidi", "Soumare", "Winks", "Faes", "Vestergaard", "Justin", "Hermansen", "Daka", "Coady", "Thomas", "Kristiansen", "Choudhury", "Stolarczyk", "McAteer", "Buonanotte", "El Khannouss", "Ayew"],
  // Ipswich
  119: ["Hutchinson", "Szmodics", "Delap", "Chaplin", "Morsy", "Luongo", "Woolfenden", "Burgess", "Davis", "Tuanzebe", "Walton", "Hirst", "Burns", "Broadhead", "Harness", "Edmundson", "Clarke", "Taylor", "Al-Hamadi", "Greaves"],
  // Southampton
  120: ["Dibling", "Armstrong", "Aribo", "Downes", "Ugochukwu", "Bednarek", "Harwood-Bellis", "Walker-Peters", "Sugawara", "McCarthy", "Brereton Diaz", "Lallana", "Smallbone", "Manning", "Stephens", "Bella-Kotchap", "Fraser", "Stewart", "Onuachu", "Archer"],

  // Spanish La Liga clubs (201-220) - unique surnames per club
  // Real Madrid
  201: ["Bellingham", "Vinicius", "Rodrygo", "Valverde", "Tchouameni", "Camavinga", "Rudiger", "Militao", "Mendy", "Carvajal", "Courtois", "Modric", "Kroos", "Nacho", "Joselu", "Ceballos", "Lucas", "Lunin", "Guler", "Endrick"],
  // Barcelona
  202: ["Yamal", "Raphinha", "Lewandowski", "Pedri", "Gavi", "De Jong", "Araujo", "Kounde", "Balde", "Cancelo", "Ter Stegen", "Felix", "Ferran", "Christensen", "Garcia", "Roberto", "Romeu", "Inigo", "Vitor Roque", "Torre"],
  // Atletico Madrid
  203: ["Griezmann", "Morata", "Correa", "Llorente", "Koke", "De Paul", "Gimenez", "Savic", "Hermoso", "Lino", "Oblak", "Lemar", "Saul", "Witsel", "Molina", "Reinildo", "Azpilicueta", "Riquelme", "Barrios", "Sorloth"],
  // Sevilla
  204: ["En-Nesyri", "Ocampos", "Suso", "Rakitic", "Fernando", "Gudelj", "Diego Carlos", "Acuna", "Navas", "Bono", "Lamela", "Papu Gomez", "Jordan", "Montiel", "Rekik", "Nianzou", "Rafa Mir", "Pedrosa", "Lukebakio", "Badé"],
  // Real Sociedad
  205: ["Oyarzabal", "Kubo", "Barrenetxea", "Merino", "Zubimendi", "Brais", "Le Normand", "Zubeldia", "Aramburu", "Remiro", "Silva", "Mendez", "Turrientes", "Elustondo", "Pacheco", "Navarro", "Olasagasti", "Becker", "Sadiq", "Oskarsson"],
  // Real Betis
  206: ["Fekir", "Isco", "Ayoze", "Canales", "Guido", "William", "Pezzella", "Luiz Felipe", "Miranda", "Sabaly", "Bravo", "Juanmi", "Iglesias", "Ruibal", "Roca", "Abner", "Cardoso", "Fornals", "Bakambu", "Assane"],
  // Villarreal
  207: ["Gerard Moreno", "Baena", "Parejo", "Capoue", "Comesana", "Albiol", "Pedraza", "Foyth", "Rulli", "Chukwueze", "Pino", "Coquelin", "Pepe Reina", "Terrats", "Gueye", "Barry", "Akhomach", "Yeremy", "Danjuma", "Morales"],
  // Athletic Bilbao
  208: ["Nico Williams", "Sancet", "Guruzeta", "Vesga", "Prados", "Ruiz de Galarreta", "Vivian", "Yeray", "Yuri", "De Marcos", "Simon", "Berenguer", "Herrera", "Paredes", "Lekue", "Gorosabel", "Jauregizar", "Unai Gomez", "Inaki Williams", "Muniain"],
  // Valencia
  209: ["Hugo Duro", "Mir", "Pepelu", "Guillamon", "Almeida", "Guerra", "Diakhaby", "Gaya", "Correia", "Mamardashvili", "Foulquier", "Yaremchuk", "Canos", "Javi Guerra", "Rioja", "Gasiorowski", "Diego Lopez", "Sergi Canos", "Mosquera", "Thierry"],
  // Girona
  210: ["Dovbyk", "Tsygankov", "Bryan Gil", "Herrera", "Martin", "Blind", "Lopez", "Gutierrez", "Arnau", "Gazzaniga", "Stuani", "Portu", "Savio", "Yangel", "Juanpe", "David Lopez", "Oriol Romeu", "Yan Couto", "Asprilla", "Solís"],
  // Celta Vigo
  211: ["Aspas", "Mingueza", "Bamba", "Beltran", "Tapia", "Veiga", "Starfelt", "Aidoo", "Mallo", "Manquillo", "Villar", "Cervi", "Swedberg", "Carles Perez", "Gabri Veiga", "Javi Galan", "Unai Nunez", "Fran Beltran", "Williot", "Larsen"],
  // Osasuna
  212: ["Budimir", "Aimar", "Oroz", "Moncayola", "Torro", "Brasanac", "Catena", "Cruz", "Nacho Vidal", "Sergio Herrera", "Ruben Garcia", "Kike", "Abde", "Pena", "Boyomo", "Herrando", "Iker Munoz", "Pablo Ibanez", "Zaragoza", "Areso"],
  // Getafe
  213: ["Borja Mayoral", "Unal", "Arambarri", "Maksimovic", "Milla", "Alena", "Djene", "Duarte", "Rico", "Soria", "Greenwood", "Latasa", "Nyom", "Alderete", "Damian", "Yellu", "Peter", "Coba", "Iglesias", "Berrocal"],
  // Rayo Vallecano
  214: ["De Tomas", "Camello", "Isi", "Trejo", "Ciss", "Valentin", "Lejeune", "Fran Garcia", "Balliu", "Dimitrievski", "Alvaro Garcia", "Embarba", "Nteka", "Palazon", "Mumin", "Pathe", "Andres Martin", "Sergio Camello", "Ratiu", "Oscar Trejo"],
  // Mallorca
  215: ["Muriqi", "Dani Rodriguez", "Kang-in Lee", "Baba", "Morlanes", "Costa", "Valjent", "Raillo", "Maffeo", "Jaume Costa", "Greif", "Larin", "Asano", "Copete", "Nastasic", "Galarreta", "Darder", "Abdon", "Sergi Darder", "Mascarell"],
  // Las Palmas
  216: ["Sandro", "Moleiro", "Munir", "Kirian", "Loiodice", "Essugo", "Suarez", "McKenna", "Marmol", "Cillessen", "Cardona", "Viera", "Marvin", "Benito", "Coco", "Rozada", "Januzaj", "Fabio Silva", "Marc Cardona", "Sinkgraven"],
  // Alaves
  217: ["Guridi", "Stoichkov", "Blanco", "Guevara", "Pina", "Abqar", "Tenaglia", "Sedlar", "Sivera", "Conechny", "Toni Martinez", "Carlos Martin", "Mourino", "Diarra", "Rebbach", "Protesoni", "Djalo", "Jon Guridi", "Rioja", "Kike Garcia"],
  // Espanyol
  218: ["Puado", "Braithwaite", "Gragera", "Bare", "Aguado", "Cabrera", "Olive", "El Hilali", "Joan Garcia", "Melamed", "Lozano", "Kumbulla", "Calero", "Vidal", "Tejero", "Pol Lozano", "Javi Puado", "Aleix Vidal", "Jofre", "Veliz"],
  // Leganes
  219: ["Juan Cruz", "Neyou", "Cisse", "Rosier", "Sergio Gonzalez", "Javi Hernandez", "Franquesa", "Dmitrovic", "Saenz", "Diego Garcia", "Dani Raba", "Enric Franquesa", "Oscar Rodriguez", "Haller", "Chicco", "Neyou Noupa", "Dani Parra", "Munir El Haddadi", "Tapia", "Nastasic"],
  // Valladolid
  220: ["Sylla", "Moro", "Kenedy", "Kike Perez", "Meseguer", "Juric", "Juma", "Rosa", "Luis Perez", "Hein", "Amath", "Marcos Andre", "Ivan Sanchez", "David Torres", "Sergio Leon", "Raul Moro", "Selim Amallah", "Anuar", "Sanchez", "Weissman"],

  // Bosnian Premier League clubs (301-312) - unique surnames per club
  // FK Sarajevo
  301: ["Ahmetović", "Muharemović", "Zukić", "Hebibović", "Rahmanović", "Krpić", "Šabanović", "Velić", "Huseinbašić", "Memić", "Turković", "Bešlija", "Salčinović", "Dupovac", "Tatar", "Čomor", "Kazazić", "Handžić", "Šerbečić", "Ćosović"],
  // FK Željezničar
  302: ["Beganović", "Čolić", "Hasanović", "Jazvin", "Lončar", "Mešanović", "Nukić", "Osmić", "Pandža", "Selimović", "Tahirović", "Velagić", "Zolotić", "Ademović", "Bičakčić", "Ćosić", "Mujakić", "Zeba", "Šišić", "Hrelja"],
  // FK Borac Banja Luka
  303: ["Grahovac", "Đurić", "Stevanović", "Kojić", "Zeljković", "Savić", "Krstić", "Todorović", "Janković", "Maksimović", "Radovanović", "Simić", "Vasić", "Lazić", "Marković", "Nikolić", "Petrović", "Ristić", "Stanković", "Tomić"],
  // HŠK Zrinjski Mostar
  304: ["Bilbija", "Ćorić", "Dolček", "Erceg", "Galić", "Hrustić", "Ivanković", "Jurić", "Knežević", "Lovrić", "Marić", "Oršolić", "Perić", "Radić", "Stojić", "Vranješ", "Zovko", "Menalo", "Todorović", "Ćavar"],
  // FK Velež Mostar
  305: ["Alispahić", "Brkić", "Ćatić", "Delić", "Efendić", "Fazlić", "Gušo", "Halilović", "Isaković", "Jusić", "Kapić", "Latić", "Mujić", "Nuhanović", "Omerović", "Pašić", "Ramović", "Smajić", "Terzić", "Uzunović"],
  // NK Široki Brijeg
  306: ["Anđelić", "Barbarić", "Čolak", "Dragičević", "Ereš", "Grgić", "Hrkać", "Ivančić", "Jelić", "Knezović", "Martinović", "Naletilić", "Ostojić", "Pavlović", "Raguž", "Soldo", "Vrdoljak", "Zadro", "Barišić", "Ćutuk"],
  // FK Tuzla City
  307: ["Alibegović", "Bešlagić", "Čaušević", "Dautović", "Fazlagić", "Ganić", "Hasić", "Ibrahimović", "Jahić", "Ličina", "Mujkić", "Nurkić", "Omerbašić", "Pašalić", "Rizvanović", "Salihović", "Tursunović", "Ustamuić", "Karić", "Softić"],
  // FK Sloboda Tuzla
  308: ["Aganović", "Bajrić", "Čehajić", "Delibašić", "Elezović", "Fetahović", "Gojković", "Hamzić", "Imširović", "Jašarević", "Kahrimanović", "Lemeš", "Mešić", "Nuhić", "Okić", "Pjanić", "Redžić", "Tinjić", "Uzicanin", "Hadžić"],
  // NK Posušje
  309: ["Andrić", "Bošnjak", "Čuljak", "Drljo", "Grubešić", "Herceg", "Ilić", "Kordić", "Leko", "Nikolić", "Oroz", "Pehar", "Slišković", "Vegar", "Zubac", "Miličević", "Prskalo", "Šarić", "Tomić", "Filipović"],
  // FK Igman Konjic
  310: ["Alagić", "Bašić", "Čengić", "Dedić", "Elkaz", "Ferhatović", "Gačanin", "Hadžiahmetović", "Imamović", "Jusufović", "Kadrić", "Lagumdžija", "Merdžanić", "Osmanović", "Ramić", "Smajlović", "Tiro", "Zec", "Begić", "Ćatović"],
  // FK Radnik Bijeljina
  311: ["Aleksić", "Bogdanović", "Cvjetković", "Davidović", "Erić", "Gajić", "Ilić", "Jovanović", "Kovačević", "Lazarević", "Nedić", "Obradović", "Radić", "Todorović", "Vasić", "Živković", "Mitrović", "Panić", "Stojanović", "Filipović"],
  // NK GOŠK Gabela
  312: ["Bošnjak", "Dragičević", "Grgić", "Hrkać", "Ivančić", "Jelić", "Knezović", "Lončar", "Martinović", "Naletilić", "Ostojić", "Pavlović", "Raguž", "Soldo", "Tomić", "Vrdoljak", "Zovko", "Ćorić", "Marić", "Perić"],
};

// Get surnames for a club (custom or default)
export function getClubSurnames(clubId: number, customSurnames?: string[]): string[] {
  if (customSurnames && customSurnames.length > 0) {
    return customSurnames;
  }
  return defaultClubSurnames[clubId] || [];
}

// Get a random surname from club's surname pool
export function getRandomClubSurname(clubId: number, customSurnames?: string[]): string {
  const surnames = getClubSurnames(clubId, customSurnames);
  if (surnames.length === 0) return "Unknown";
  return surnames[Math.floor(Math.random() * surnames.length)];
}
