"""
Board-wise syllabus data: Board → Class → Subject → Chapters
Used by the MCQ generator to populate dropdowns and validate inputs.
"""

# CBSE Chapters
cbse_5 = {
    "Mathematics": ["The Fish Tale", "Shapes and Angles", "How Many Squares", "Parts and Wholes", "Does it Look the Same?", "Be My Multiple I'll be Your Factor", "Can You See the Pattern", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big How Heavy"],
    "EVS": ["Super Senses", "A Snake Charmer's Story", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", "Experiments with Water", "A Treat for Mosquitoes", "Up You Go", "Walls Tell Stories", "Sunita in Space", "What if it Finishes", "A Shelter so High", "When the Earth Shook", "Blow Hot Blow Cold", "Who will do this Work", "Across the Wall", "No Place for Us", "A Seed tells a Farmer's Story", "Whose Forests", "Like Father Like Daughter", "On the Move Again"],
    "English": ["Ice-cream Man", "Wonderful Waste", "Teamwork", "Flying Together", "My Shadow", "Robinson Crusoe", "Crying", "My Elder Brother", "The Lazy Frog", "Rip Van Winkle", "Class Discussion", "The Talkative Barber", "Topsy-turvy Land", "Gulliver's Travels", "Nobody's Friend", "The Little Bully", "Sing a Song of People", "Around the World", "Malu Bhalu", "Who Will be Ningthou"],
    "Hindi": ["Rakh Ki Rassi", "Faslon Ke Tyohar", "Khiloune Wala", "Nanh Fankar", "Jahan Chah Wahan Raah", "Chitthi Ka Safar", "Dakiye Ki Kahani", "Ve Din Bhi Kya Din The", "Ek Maa Ki Bebasi", "Ek Din Ki Badshahat", "Chawal Ki Rotiyan", "Guru Aur Chela", "Swami Ki Dadi", "Bagh Aaya Us Raat", "Bishan Ki Dileri", "Pani Re Pani", "Chhoti Si Hamari Nadi", "Chunauti Himalay Ki"]
}

cbse_6 = {
    "Mathematics": ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion", "Symmetry", "Practical Geometry"],
    "Science": ["Food: Where Does It Come From", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms", "Motion and Measurement", "Light Shadows and Reflection", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In Garbage Out"],
    "Social Science": ["History: What Where How and When", "History: On The Trail of the Earliest People", "History: From Gathering to Growing Food", "History: In the Earliest Cities", "History: Kings and Early Republic", "History: New Questions and Ideas", "Geography: The Earth in the Solar System", "Geography: Globe Latitudes and Longitudes", "Geography: Motions of the Earth", "Geography: Maps", "Geography: Major Domains of the Earth", "Civics: Understanding Diversity", "Civics: Diversity and Discrimination", "Civics: What is Government", "Civics: Panchayati Raj", "Civics: Rural Administration"],
    "English": ["Who Did Patrick's Homework", "How the Dog Found Himself a New Master", "Taro's Reward", "An Indian American Woman in Space", "A Different Kind of School", "Who I Am", "Fair Play", "A Game of Chance", "Desert Animals", "The Banyan Tree"],
    "Hindi": ["Vah Chidiya Jo", "Bachpan", "Nadaan Dost", "Chaand Se Thodi Si Gappe", "Aksharon Ka Mahatva", "Paar Nazar Ke", "Saathi Haath Badhana", "Aise Aise", "Ticket Album", "Jhansi Ki Rani", "Jo Dekhkar Bhi Nahi Dekhte", "Sansaar Pustak Hai", "Main Sabse Chhoti Hoon", "Lokgeet", "Naukar", "Van Ke Marg Mein", "Saans Saans Mein Baans"]
}

cbse_7 = {
    "Mathematics": ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"],
    "Science": ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids Bases and Salts", "Physical and Chemical Changes", "Weather Climate and Adaptations of Animals to Climate", "Winds Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story"],
    "Social Science": ["Tracing Changes Through A Thousand Years", "New Kings And Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers And Buildings", "Towns Traders And Craftspersons", "Tribes Nomads And Settled Communities", "Devotional Paths To The Divine", "The Making Of Regional Cultures", "Eighteenth-Century Political Formations", "Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Natural Vegetation and Wildlife", "Human Environment", "On Equality", "Role of the Government in Health", "How the State Government Works", "Growing Up as Boys and Girls", "Women Change the World", "Understanding Media", "Markets Around Us", "A Shirt in the Market", "Struggles for Equality"],
    "English": ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes That Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire Friend and Foe", "A Bicycle in Good Repair", "The Story of Cricket"],
    "Hindi": ["Hum Panchhi Unmukt Gagan Ke", "Dadi Maa", "Himalay Ki Betiyan", "Kathputli", "Mithaiwala", "Rakt Aur Hamara Sharir", "Papa Kho Gaye", "Shaam Ek Kisan", "Chidiya Ki Bachi", "Apurv Anubhav", "Rahim Ke Dohe", "Kancha", "Ek Tinka", "Khanpan Ki Badalti Tasvir", "Neelkanth", "Bhor Aur Barkha", "Veer Kunwar Singh", "Sangharsh Ke Karan Main Tunukmizaj Ho Gaya", "Ashram Ka Anumanit Vyay", "Viplav Gayan"]
}

cbse_8 = {
    "Mathematics": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs", "Playing with Numbers"],
    "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and The Solar System", "Pollution of Air and Water"],
    "Social Science": ["How When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals Dikus and the Vision of a Golden Age", "When People Rebel", "Weavers Iron Smelters and Factory Owners", "Civilising the Native Educating the Nation", "Women Caste and Reform", "The Making of the National Movement", "India After Independence", "Resources", "Land Soil Water Natural Vegetation and Wildlife Resources", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "The Indian Constitution", "Understanding Secularism", "Why Do We Need a Parliament", "Understanding Laws", "Judiciary", "Understanding Our Criminal Justice System", "Understanding Marginalisation", "Confronting Marginalisation", "Public Facilities", "Law and Social Justice"],
    "English": ["The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury's Lapse of Memory", "The Summit Within", "This is Jody's Fawn", "A Visit to Cambridge", "A Short Monsoon Diary", "The Great Stone Face - I", "The Great Stone Face - II"],
    "Hindi": ["Dhwani", "Lakh Ki Chudiyan", "Bus Ki Yatra", "Dewano Ki Hasti", "Chitthiyon Ki Anoothi Duniya", "Bhagwan Ke Dakiye", "Kya Nirash Hua Jaye", "Yeh Sabse Kathin Samay Nahi", "Kabir Ki Sakhiyan", "Kaamchor", "Jab Cinema Ne Bolna Seekha", "Sudama Charit", "Jahan Pahiya Hai", "Akbari Lota", "Sur Ke Pad", "Pani Ki Kahani", "Baaz Aur Saanp", "Topi"]
}

cbse_9_10 = {
    "Mathematics": ["Real Numbers", "Polynomials", "Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Chemical Reactions and Equations", "Acids Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce", "Heredity and Evolution", "Light Reflection and Refraction", "Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Sustainable Management of Natural Resources"],
    "Social Science": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy", "Power Sharing", "Federalism", "Democracy and Diversity", "Gender Religion and Caste", "Popular Struggles and Movements", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"],
    "English": ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal"],
    "Hindi": ["Surdas", "Tulsidas", "Dev", "Jayashankar Prasad", "Suryakant Tripathi Nirala", "Nagarjun", "Girija Kumar Mathur", "Rituraj", "Manglesh Dabral", "Swayam Prakash", "Ramvriksh Benipuri", "Yashpal", "Sarveshwar Dayal Saxena", "Mannu Bhandari", "Mahavir Prasad Dwivedi", "Yatindra Mishra", "Bhadant Anand Kausalyayan"]
}

# SSC Details
ssc_5 = {
    "Mathematics": ["Roman Numerals", "Number Work", "Addition and Subtraction", "Multiplication and Division", "Fractions", "Angles", "Circles", "Multiples and Factors", "Decimal Fractions", "Measuring Time", "Problems on Measurement", "Perimeter and Area", "Three Dimensional Objects and Nets", "Pictographs", "Patterns", "Preparation for Algebra"],
    "Environmental Studies Part 1": ["Our Earth and Our Solar System", "Motions of the Earth", "The Earth and its Living World", "Environmental Balance", "Family Values", "Rules are for Everyone", "Let us Solve our own Problems", "Public Facilities and my School", "Maps our Companions", "Getting to Know India", "Our Home and Environment", "Food for All", "Methods of Preserving Food", "Transport", "Communication and Mass Media", "Water", "Clothes our Necessity", "The Environment and Us"],
    "Environmental Studies Part 2": ["What is History", "History and the Concept of Time", "Life on Earth", "Evolution", "Evolution of Mankind", "Stone Age: Stone Tools", "From Shelters to Village-settlements", "Beginning of Settled Life", "Settled Life and Urban Civilization", "Historic Period"],
    "English": ["What a Bird Thought", "Daydreams", "Be a Good Listener", "Strawberries", "The Twelve Months", "Announcements", "Major Dhyan Chand", "A Great Leader", "The Magic Brocade", "The Story of the Past", "A Book Review", "Write your own Poem", "Sensory Organs", "Speaking Hours"]
}

ssc_6 = {
    "Mathematics": ["Basic Concepts in Geometry", "Angles", "Integers", "Operations on Fractions", "Decimal Fractions", "Bar Graphs", "Symmetry", "Divisibility", "HCF-LCM", "Equations", "Ratio-Proportion", "Percentage", "Profit-Loss", "Banks and Simple Interest", "Triangles and their Properties", "Quadrilaterals", "Geometrical Constructions", "Three Dimensional Shapes"],
    "Science": ["Natural Resources - Air, Water and Land", "The Living World", "Diversity in Living Things and their Classification", "Disaster Management", "Substances in the Surroundings - Their States and Properties", "Substances in Daily Use", "Nutrition and Diet", "Our Skeletal System and the Skin", "Motion and Types of Motion", "Force and Types of Force", "Work and Energy", "Simple Machines", "Sound", "Light and the Formation of Shadows", "Fun with Magnets", "The Universe"],
    "History & Civics": ["The Indian Subcontinent and History", "Sources of History", "The Harappan Civilization", "The Vedic Civilization", "Religious Trends in Ancient India", "Janapadas and Mahajanapadas", "India during the Maurya Period", "States after the Maurya Empire", "Ancient Kingdoms of the South", "Ancient India: Cultural", "Ancient India and the World", "Our Life in Society", "Diversity in Society", "Rural Local Government Bodies", "Urban Local Government Bodies", "District Administration"],
    "Geography": ["The Earth and the Graticule", "Let us Use the Graticule", "Comparing a Globe and a Map; Field Visits", "Weather and Climate", "Temperature", "Importance of Oceans", "Rocks and Rock Types", "Natural Resources", "Energy Resources", "Human Occupations"]
}

ssc_7 = {
    "Mathematics": ["Geometrical Constructions", "Multiplication and Division of Integers", "HCF and LCM", "Angles and Pairs of Angles", "Operations on Rational Numbers", "Indices", "Joint Bar Graph", "Algebraic Expressions and Operations on them", "Direct Proportion and Inverse Proportion", "Banks and Simple Interest", "Circle", "Perimeter and Area", "Pythagoras Theorem", "Algebraic Formulae - Expansion of Squares", "Statistics"],
    "Science": ["The Living World: Adaptations and Classification", "Plants: Structure and Function", "Properties of Natural Resources", "Nutrition in Living Organisms", "Food Safety", "Measurement of Physical Quantities", "Motion Force and Work", "Static Electricity", "Heat", "Disaster Management", "Cell Structure and Micro-organisms", "The Muscular System and Digestive System in Human Beings", "Changes: Physical and Chemical", "Elements Compounds and Mixtures", "Materials we Use", "Natural Resources", "Effects of Light", "Sound: Production of Sound", "Properties of a Magnetic Field", "In the World of Stars"],
    "History & Civics": ["Sources of History", "India before the Times of Shivaji Maharaj", "Religious Synthesis", "Maharashtra before the Times of Shivaji Maharaj", "The Foundation of the Swaraj", "Conflict with the Mughals", "The Administration of the Swaraj", "An Ideal Ruler", "The Maratha War of Independence", "The Expansion of the Maratha Power", "Marathas - The Protectors of the Nation", "Progression of the Empire", "Life of the People in Maharashtra", "Introduction to our Constitution", "Preamble to the Constitution", "Features of the Constitution", "Fundamental Rights Part 1", "Fundamental Rights Part 2", "Directive Principles of State Policy and Fundamental Duties"],
    "Geography": ["How Seasons Occur Part 1", "The Sun the Moon and the Earth", "Tides", "Air Pressure", "Winds", "Natural Regions", "Soils", "How Seasons Occur Part 2", "Agriculture", "Human Settlements", "Contour Maps and Landforms"]
}

ssc_8 = {
    "Mathematics": ["Rational and Irrational Numbers", "Parallel Lines and Transversals", "Indices and Cube Root", "Altitudes and Medians of a Triangle", "Expansion Formulae", "Factorisation of Algebraic Expressions", "Variation", "Quadrilateral: Constructions and Types", "Discount and Commission", "Division of Polynomials", "Statistics", "Equations in One Variable", "Congruence of Triangles", "Compound Interest", "Area", "Surface Area and Volume", "Circle: Chord and Arc"],
    "Science": ["Living World and Classification of Microbes", "Health and Diseases", "Force and Pressure", "Current Electricity and Magnetism", "Inside the Atom", "Composition of Matter", "Metals and Nonmetals", "Pollution", "Disaster Management", "Cell and Cell Organelles", "Human Body and Organ System", "Introduction to Acid and Base", "Chemical Change and Chemical Bond", "Measurement and Effects of Heat", "Sound", "Reflection of Light", "Man made Materials", "Ecosystems", "Life Cycle of Stars"],
    "History & Civics": ["Sources of History", "Europe and India", "Effects of British Rule", "The Freedom Struggle of 1857", "Social and Religious Reforms", "Beginning of Freedom Movement", "Non-co-operation Movement", "Civil Disobedience Movement", "Last Phase of Struggle for Independence", "Armed Revolutionary Movement", "Struggle for Equality", "India gains Independence", "Fulfillment of Struggle for Independence", "Formation of State of Maharashtra", "Introduction to the Parliamentary System", "The Indian Parliament", "The Union Executive", "The Indian Judicial System", "The State Government", "Bureaucracy"],
    "Geography": ["Local Time and Standard Time", "Interior of the Earth", "Humidity and Clouds", "Structure of Ocean Floor", "Ocean Currents", "Land Use", "Population", "Industries", "Map Scale", "Field Visit"]
}

ssc_9 = {
    "Mathematics Part I": ["Sets", "Real Numbers", "Polynomials", "Ratio and Proportion", "Linear Equations in Two Variables", "Financial Planning", "Statistics"],
    "Mathematics Part II": ["Basic Concepts in Geometry", "Parallel Lines", "Triangles", "Constructions of Triangles", "Quadrilaterals", "Circle", "Co-ordinate Geometry", "Trigonometry", "Surface Area and Volume"],
    "Science and Technology": ["Laws of Motion", "Work and Energy", "Current Electricity", "Measurement of Matter", "Acids Bases and Salts", "Classification of Plants", "Energy Flow in an Ecosystem", "Useful and Harmful Microbes", "Environmental Management", "Information Communication Technology", "Reflection of Light", "Study of Sound", "Carbon: An Important Element", "Substances in Common Use", "Life Processes in Living Organisms", "Heredity and Variation", "Introduction to Biotechnology", "Observing Space: Telescopes"],
    "History & Civics": ["Sources of History", "India: Events after 1960", "India's Internal Challenges", "Economic Development", "Education", "Empowerment of Women and other Weaker Sections", "Science and Technology", "Industry and Trade", "Changing Life: 1", "Changing Life: 2", "Post World War Political Developments", "India's Foreign Policy", "India's Defence System", "The United Nations", "India and Other Countries", "International Problems"],
    "Geography": ["Distributional Maps", "Endogenetic Movements", "Exogenetic Processes Part-1", "Exogenetic Processes Part-2", "Precipitation", "The Properties of Sea Water", "International Date Line", "Introduction to Economics", "Trade", "Urbanisation", "Transport and Communication", "Tourism"]
}

ssc_10 = {
    "Mathematics Part I": ["Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progression", "Financial Planning", "Probability", "Statistics"],
    "Mathematics Part II": ["Similarity", "Pythagoras Theorem", "Circle", "Geometric Constructions", "Co-ordinate Geometry", "Trigonometry", "Mensuration"],
    "Science and Technology Part 1": ["Gravitation", "Periodic Classification of Elements", "Chemical Reactions and Equations", "Effects of Electric Current", "Heat", "Refraction of Light", "Lenses", "Metallurgy", "Carbon Compounds", "Space Missions"],
    "Science and Technology Part 2": ["Heredity and Evolution", "Life Processes in Living Organisms Part 1", "Life Processes in Living Organisms Part 2", "Environmental Management", "Towards Green Energy", "Animal Classification", "Introduction to Microbiology", "Cell Biology and Biotechnology", "Social Health", "Disaster Management"],
    "History & Civics": ["Historiography Development in the West", "Historiography Indian Tradition", "Applied History", "History of Indian Arts", "Mass Media and History", "Entertainment and History", "Sports and History", "Tourism and History", "Heritage Management", "Working of the Constitution", "The Electoral Process", "Political Parties", "Social and Political Movements", "Challenges faced by Indian Democracy"],
    "Geography": ["Field Visit", "Location and Extent", "Physiography and Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "Human Settlements", "Economy and Occupations", "Tourism Transport and Communication"]
}

class_11_12_science = {
    "Physics": ["Electric Charges and Fields", "Electrostatic Potential", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics", "Wave Optics", "Dual Nature of Radiation", "Atoms", "Nuclei", "Semiconductor Electronics"],
    "Chemistry": ["Solutions", "Electrochemistry", "Chemical Kinetics", "d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"],
    "Mathematics": ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"],
    "Biology": ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production", "Microbes in Human Welfare", "Biotechnology", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues"],
    "Computer Science": ["Python Programming", "Data Structures", "Database Management", "Computer Networks"],
    "English Core": ["Reading Comprehension", "Creative Writing", "Literature - Flamingo", "Literature - Vistas"]
}

BOARDS_DATA = {
    "CBSE": {
        "Class 5": cbse_5,
        "Class 6": cbse_6,
        "Class 7": cbse_7,
        "Class 8": cbse_8,
        "Class 9": cbse_9_10,
        "Class 10": cbse_9_10
    },
    "Maharashtra Board": {
        "Class 5": ssc_5,
        "Class 6": ssc_6,
        "Class 7": ssc_7,
        "Class 8": ssc_8,
        "Class 9": ssc_9,
        "Class 10": ssc_10
    },
    "ICSE": {
        "Class 5": cbse_5,
        "Class 6": cbse_6,
        "Class 7": cbse_7,
        "Class 8": cbse_8,
        "Class 9": cbse_9_10,
        "Class 10": cbse_9_10
    }
}
