// Disease treatment information mapped from class_indices.json
export const diseaseTreatments = {
  "Apple___Apple_scab": {
    name: "Apple Scab",
    description: "A fungal disease that causes dark, scab-like lesions on apple fruit and leaves.",
    treatment: [
      "Apply fungicide spray with captan or mancozeb at regular intervals",
      "Remove fallen leaves and infected plant debris",
      "Ensure proper air circulation by pruning",
      "Choose resistant apple varieties for future planting",
      "Apply dormant season spray with copper or lime sulfur"
    ],
    prevention: [
      "Plant disease-resistant varieties",
      "Maintain proper spacing between trees",
      "Regular monitoring and early detection",
      "Good orchard sanitation"
    ],
    severity: "Moderate",
    cause: "Fungal (Venturia inaequalis)"
  },
  "Apple___Black_rot": {
    name: "Apple Black Rot",
    description: "A fungal disease causing dark, sunken lesions on apple fruit and cankers on branches.",
    treatment: [
      "Remove and destroy infected fruits and branches",
      "Apply fungicide containing captan or thiophanate-methyl",
      "Prune infected branches during dormant season",
      "Maintain good orchard sanitation",
      "Apply copper-based fungicides during dormant season"
    ],
    prevention: [
      "Remove mummified fruits from trees and ground",
      "Prune for good air circulation",
      "Regular fungicide applications during growing season",
      "Choose less susceptible varieties"
    ],
    severity: "High",
    cause: "Fungal (Botryosphaeria obtusa)"
  },
  "Apple___Cedar_apple_rust": {
    name: "Cedar Apple Rust",
    description: "A fungal disease that requires both apple and cedar trees to complete its lifecycle.",
    treatment: [
      "Apply preventive fungicide sprays with myclobutanil or propiconazole",
      "Remove nearby cedar or juniper trees if possible",
      "Use systemic fungicides during early infection stages",
      "Rake and dispose of infected leaves",
      "Apply multiple fungicide applications during spring"
    ],
    prevention: [
      "Plant resistant apple varieties",
      "Remove cedar/juniper trees within 1-2 miles if feasible",
      "Start preventive fungicide program early in spring",
      "Monitor for early symptoms"
    ],
    severity: "Moderate",
    cause: "Fungal (Gymnosporangium juniperi-virginianae)"
  },
  "Apple___healthy": {
    name: "Healthy Apple",
    description: "No disease detected. The apple plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization and watering",
      "Good orchard hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Blueberry___healthy": {
    name: "Healthy Blueberry",
    description: "No disease detected. The blueberry plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization and watering",
      "Maintain soil pH between 4.5-5.5"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Cherry_(including_sour)___Powdery_mildew": {
    name: "Cherry Powdery Mildew",
    description: "A fungal disease causing white, powdery growth on leaves and shoots.",
    treatment: [
      "Apply fungicide with sulfur, potassium bicarbonate, or myclobutanil",
      "Improve air circulation around plants",
      "Remove infected plant parts",
      "Apply neem oil or horticultural oils",
      "Use baking soda spray (1 tsp per quart water)"
    ],
    prevention: [
      "Plant in areas with good air circulation",
      "Avoid overhead watering",
      "Choose resistant varieties",
      "Regular monitoring and early treatment"
    ],
    severity: "Moderate",
    cause: "Fungal (Podosphaera clandestina)"
  },
  "Cherry_(including_sour)___healthy": {
    name: "Healthy Cherry",
    description: "No disease detected. The cherry plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization and watering",
      "Good garden hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    name: "Corn Gray Leaf Spot",
    description: "A fungal disease causing rectangular gray-brown lesions on corn leaves.",
    treatment: [
      "Apply foliar fungicides with strobilurin or triazole",
      "Remove crop residue after harvest",
      "Practice crop rotation with non-host crops",
      "Use resistant corn varieties",
      "Apply fungicide at early stages of infection"
    ],
    prevention: [
      "Plant resistant varieties",
      "Rotate crops (avoid continuous corn)",
      "Till crop residue into soil",
      "Monitor weather conditions (disease favored by warm, humid weather)"
    ],
    severity: "Moderate to High",
    cause: "Fungal (Cercospora zeae-maydis)"
  },
  "Corn_(maize)___Common_rust_": {
    name: "Corn Common Rust",
    description: "A fungal disease causing reddish-brown pustules on corn leaves.",
    treatment: [
      "Apply fungicides containing propiconazole or azoxystrobin",
      "Use resistant corn hybrids",
      "Remove volunteer corn plants",
      "Practice crop rotation",
      "Apply fungicide when disease first appears"
    ],
    prevention: [
      "Plant resistant varieties",
      "Monitor for early symptoms",
      "Control volunteer corn",
      "Proper field sanitation"
    ],
    severity: "Moderate",
    cause: "Fungal (Puccinia sorghi)"
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    name: "Northern Leaf Blight",
    description: "A fungal disease causing elliptical gray-green lesions on corn leaves.",
    treatment: [
      "Apply fungicide with strobilurin or triazole active ingredients",
      "Use resistant corn hybrids",
      "Practice crop rotation",
      "Remove and bury crop residue",
      "Time fungicide applications with disease development"
    ],
    prevention: [
      "Plant resistant varieties",
      "Rotate with non-host crops",
      "Manage crop residue properly",
      "Monitor environmental conditions"
    ],
    severity: "High",
    cause: "Fungal (Exserohilum turcicum)"
  },
  "Corn_(maize)___healthy": {
    name: "Healthy Corn",
    description: "No disease detected. The corn plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good field hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Grape___Black_rot": {
    name: "Grape Black Rot",
    description: "A fungal disease causing black, mummified grapes and leaf spots.",
    treatment: [
      "Apply fungicide with mancozeb, captan, or myclobutanil",
      "Remove mummified berries and infected leaves",
      "Prune for better air circulation",
      "Apply dormant season fungicide spray",
      "Start fungicide program early in season"
    ],
    prevention: [
      "Remove infected plant debris",
      "Ensure good air circulation",
      "Regular fungicide applications",
      "Choose resistant varieties"
    ],
    severity: "High",
    cause: "Fungal (Guignardia bidwellii)"
  },
  "Grape___Esca_(Black_Measles)": {
    name: "Grape Esca (Black Measles)",
    description: "A complex fungal disease causing leaf discoloration and berry spotting.",
    treatment: [
      "Remove infected canes and spurs during dormant pruning",
      "Apply wound protectant after pruning",
      "Use trunk injection with fungicides",
      "Remove severely infected vines",
      "Apply foliar fungicides during growing season"
    ],
    prevention: [
      "Proper pruning techniques to minimize wounds",
      "Apply wound protectants",
      "Avoid mechanical damage to vines",
      "Remove infected wood promptly"
    ],
    severity: "High",
    cause: "Fungal complex (multiple species)"
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    name: "Grape Leaf Blight",
    description: "A fungal disease causing brown spots and leaf yellowing.",
    treatment: [
      "Apply copper-based fungicides",
      "Remove infected leaves and debris",
      "Improve air circulation through pruning",
      "Use protective fungicides during wet periods",
      "Apply systemic fungicides for severe infections"
    ],
    prevention: [
      "Prune for good air circulation",
      "Avoid overhead irrigation",
      "Remove fallen leaves",
      "Regular monitoring"
    ],
    severity: "Moderate",
    cause: "Fungal (Isariopsis leafspot)"
  },
  "Grape___healthy": {
    name: "Healthy Grape",
    description: "No disease detected. The grape plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good vineyard hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Orange___Haunglongbing_(Citrus_greening)": {
    name: "Citrus Greening (HLB)",
    description: "A bacterial disease transmitted by Asian citrus psyllid, causing yellowing and bitter fruit.",
    treatment: [
      "Remove and destroy infected trees immediately",
      "Control Asian citrus psyllid with insecticides",
      "Apply antibiotics (streptomycin) where permitted",
      "Improve tree nutrition with foliar feeds",
      "Use systemic insecticides for psyllid control"
    ],
    prevention: [
      "Monitor for Asian citrus psyllid",
      "Use certified disease-free nursery stock",
      "Regular inspection of trees",
      "Control psyllid populations"
    ],
    severity: "Very High (Fatal)",
    cause: "Bacterial (Candidatus Liberibacter asiaticus)"
  },
  "Peach___Bacterial_spot": {
    name: "Peach Bacterial Spot",
    description: "A bacterial disease causing spots on leaves and fruit, leading to fruit cracking.",
    treatment: [
      "Apply copper-based bactericides",
      "Use streptomycin sprays where available",
      "Remove infected plant debris",
      "Prune for better air circulation",
      "Apply preventive sprays during bloom"
    ],
    prevention: [
      "Choose resistant varieties",
      "Avoid overhead irrigation",
      "Good orchard sanitation",
      "Regular monitoring"
    ],
    severity: "Moderate to High",
    cause: "Bacterial (Xanthomonas arboricola pv. pruni)"
  },
  "Peach___healthy": {
    name: "Healthy Peach",
    description: "No disease detected. The peach plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good orchard hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Pepper,_bell___Bacterial_spot": {
    name: "Pepper Bacterial Spot",
    description: "A bacterial disease causing dark spots on leaves and fruit.",
    treatment: [
      "Apply copper-based bactericides",
      "Remove infected plants and debris",
      "Use certified disease-free seeds",
      "Improve air circulation",
      "Apply preventive bactericide sprays"
    ],
    prevention: [
      "Use resistant varieties",
      "Avoid overhead watering",
      "Rotate crops",
      "Good field sanitation"
    ],
    severity: "Moderate",
    cause: "Bacterial (Xanthomonas species)"
  },
  "Pepper,_bell___healthy": {
    name: "Healthy Pepper",
    description: "No disease detected. The pepper plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good garden hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Potato___Early_blight": {
    name: "Potato Early Blight",
    description: "A fungal disease causing dark spots with concentric rings on leaves.",
    treatment: [
      "Apply fungicide with chlorothalonil or mancozeb",
      "Remove infected plant debris",
      "Improve air circulation",
      "Use drip irrigation instead of overhead watering",
      "Apply fungicide on 7-14 day schedule"
    ],
    prevention: [
      "Plant certified disease-free seed potatoes",
      "Rotate crops (3-4 year rotation)",
      "Maintain proper plant spacing",
      "Regular monitoring"
    ],
    severity: "Moderate to High",
    cause: "Fungal (Alternaria solani)"
  },
  "Potato___Late_blight": {
    name: "Potato Late Blight",
    description: "A serious fungal disease causing dark, water-soaked lesions on leaves and tubers.",
    treatment: [
      "Apply fungicide with metalaxyl, mancozeb, or chlorothalonil",
      "Remove and destroy infected plants immediately",
      "Avoid overhead irrigation",
      "Harvest tubers in dry conditions",
      "Apply fungicide preventively in cool, moist conditions"
    ],
    prevention: [
      "Use certified seed potatoes",
      "Monitor weather conditions (disease favored by cool, moist weather)",
      "Good field drainage",
      "Preventive fungicide applications"
    ],
    severity: "Very High",
    cause: "Oomycete (Phytophthora infestans)"
  },
  "Potato___healthy": {
    name: "Healthy Potato",
    description: "No disease detected. The potato plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good field hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Raspberry___healthy": {
    name: "Healthy Raspberry",
    description: "No disease detected. The raspberry plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good garden hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Soybean___healthy": {
    name: "Healthy Soybean",
    description: "No disease detected. The soybean plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good field hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Squash___Powdery_mildew": {
    name: "Squash Powdery Mildew",
    description: "A fungal disease causing white, powdery growth on leaves.",
    treatment: [
      "Apply fungicide with sulfur or potassium bicarbonate",
      "Use neem oil or horticultural oils",
      "Improve air circulation",
      "Apply baking soda spray (1 tsp per quart water)",
      "Remove heavily infected leaves"
    ],
    prevention: [
      "Plant resistant varieties",
      "Ensure good air circulation",
      "Avoid overhead watering",
      "Regular monitoring"
    ],
    severity: "Moderate",
    cause: "Fungal (Podosphaera xanthii)"
  },
  "Strawberry___Leaf_scorch": {
    name: "Strawberry Leaf Scorch",
    description: "A fungal disease causing purple or brown spots that turn white with purple borders.",
    treatment: [
      "Apply fungicide with captan or myclobutanil",
      "Remove infected leaves and debris",
      "Improve air circulation",
      "Avoid overhead watering",
      "Apply fungicide at first sign of symptoms"
    ],
    prevention: [
      "Plant resistant varieties",
      "Good air circulation",
      "Proper plant spacing",
      "Regular monitoring"
    ],
    severity: "Moderate",
    cause: "Fungal (Diplocarpon earlianum)"
  },
  "Strawberry___healthy": {
    name: "Healthy Strawberry",
    description: "No disease detected. The strawberry plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good garden hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  },
  "Tomato___Bacterial_spot": {
    name: "Tomato Bacterial Spot",
    description: "A bacterial disease causing dark spots on leaves and fruit.",
    treatment: [
      "Apply copper-based bactericides",
      "Remove infected plants and debris",
      "Use certified disease-free seeds",
      "Improve air circulation",
      "Apply streptomycin where available"
    ],
    prevention: [
      "Use resistant varieties",
      "Avoid overhead watering",
      "Rotate crops",
      "Good field sanitation"
    ],
    severity: "Moderate",
    cause: "Bacterial (Xanthomonas species)"
  },
  "Tomato___Early_blight": {
    name: "Tomato Early Blight",
    description: "A fungal disease causing dark spots with concentric rings on leaves and fruit.",
    treatment: [
      "Apply fungicide with chlorothalonil or mancozeb",
      "Remove infected plant debris",
      "Improve air circulation",
      "Use drip irrigation",
      "Apply fungicide preventively"
    ],
    prevention: [
      "Plant resistant varieties",
      "Proper plant spacing",
      "Crop rotation",
      "Regular monitoring"
    ],
    severity: "Moderate to High",
    cause: "Fungal (Alternaria solani)"
  },
  "Tomato___Late_blight": {
    name: "Tomato Late Blight",
    description: "A serious fungal disease causing dark, water-soaked lesions on leaves and fruit.",
    treatment: [
      "Apply fungicide with metalaxyl or copper compounds",
      "Remove infected plants immediately",
      "Improve air circulation",
      "Avoid overhead watering",
      "Apply fungicide preventively in cool, moist conditions"
    ],
    prevention: [
      "Use certified disease-free transplants",
      "Monitor weather conditions",
      "Good air circulation",
      "Preventive fungicide applications"
    ],
    severity: "Very High",
    cause: "Oomycete (Phytophthora infestans)"
  },
  "Tomato___Leaf_Mold": {
    name: "Tomato Leaf Mold",
    description: "A fungal disease causing yellow spots on upper leaf surfaces and fuzzy growth underneath.",
    treatment: [
      "Improve ventilation and reduce humidity",
      "Apply fungicide with chlorothalonil or copper",
      "Remove infected leaves",
      "Avoid overhead watering",
      "Use resistant varieties"
    ],
    prevention: [
      "Ensure good air circulation",
      "Control humidity in greenhouses",
      "Plant resistant varieties",
      "Proper plant spacing"
    ],
    severity: "Moderate",
    cause: "Fungal (Passalora fulva)"
  },
  "Tomato___Septoria_leaf_spot": {
    name: "Tomato Septoria Leaf Spot",
    description: "A fungal disease causing small, circular spots with dark borders on leaves.",
    treatment: [
      "Apply fungicide with chlorothalonil or mancozeb",
      "Remove infected lower leaves",
      "Improve air circulation",
      "Use drip irrigation",
      "Apply mulch to prevent soil splashing"
    ],
    prevention: [
      "Rotate crops",
      "Remove plant debris",
      "Proper plant spacing",
      "Regular monitoring"
    ],
    severity: "Moderate",
    cause: "Fungal (Septoria lycopersici)"
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    name: "Two-spotted Spider Mite",
    description: "A pest causing stippling, yellowing, and webbing on tomato leaves.",
    treatment: [
      "Apply miticide or insecticidal soap",
      "Increase humidity around plants",
      "Use predatory mites as biological control",
      "Spray with water to dislodge mites",
      "Apply neem oil or horticultural oils"
    ],
    prevention: [
      "Regular monitoring",
      "Maintain adequate humidity",
      "Avoid over-fertilization with nitrogen",
      "Use biological controls"
    ],
    severity: "Moderate",
    cause: "Pest (Tetranychus urticae)"
  },
  "Tomato___Target_Spot": {
    name: "Tomato Target Spot",
    description: "A fungal disease causing concentric ring patterns on leaves and fruit.",
    treatment: [
      "Apply fungicide with chlorothalonil or azoxystrobin",
      "Remove infected plant debris",
      "Improve air circulation",
      "Use drip irrigation",
      "Rotate crops"
    ],
    prevention: [
      "Plant resistant varieties",
      "Good air circulation",
      "Proper sanitation",
      "Regular monitoring"
    ],
    severity: "Moderate",
    cause: "Fungal (Corynespora cassiicola)"
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    name: "Tomato Yellow Leaf Curl Virus",
    description: "A viral disease causing yellowing, curling leaves and stunted growth.",
    treatment: [
      "Remove infected plants immediately",
      "Control whitefly vectors with insecticides",
      "Use reflective mulches",
      "Apply systemic insecticides",
      "Use virus-free transplants"
    ],
    prevention: [
      "Use resistant varieties",
      "Control whitefly populations",
      "Use physical barriers (row covers)",
      "Regular monitoring"
    ],
    severity: "High",
    cause: "Viral (transmitted by whiteflies)"
  },
  "Tomato___Tomato_mosaic_virus": {
    name: "Tomato Mosaic Virus",
    description: "A viral disease causing mottled yellowing and distorted leaves.",
    treatment: [
      "Remove infected plants immediately",
      "Disinfect tools and hands",
      "Control aphid vectors",
      "Use virus-free seeds and transplants",
      "No chemical cure available"
    ],
    prevention: [
      "Use resistant varieties",
      "Control aphid vectors",
      "Good sanitation practices",
      "Avoid handling wet plants"
    ],
    severity: "High",
    cause: "Viral (Tomato mosaic virus)"
  },
  "Tomato___healthy": {
    name: "Healthy Tomato",
    description: "No disease detected. The tomato plant appears healthy.",
    treatment: [
      "Continue regular maintenance practices",
      "Monitor for early signs of diseases",
      "Maintain proper nutrition and watering"
    ],
    prevention: [
      "Regular inspection of plants",
      "Proper fertilization",
      "Good garden hygiene"
    ],
    severity: "None",
    cause: "No disease present"
  }
};

// Helper function to get treatment info by disease key
export const getTreatmentInfo = (diseaseKey: string) => {
  // First try exact match
  let treatment = diseaseTreatments[diseaseKey as keyof typeof diseaseTreatments];
  
  if (treatment) {
    return treatment;
  }
  
  // The key insight: "Apple   Apple scab" should become "Apple___Apple_scab"
  // The pattern is: triple underscores only between the first two words, single underscore for the rest
  
  // Clean up spaces and split into parts
  const cleanKey = diseaseKey.trim();
  const normalizedSpaces = cleanKey.replace(/\s+/g, ' ');
  const parts = normalizedSpaces.split(' ');
  
  if (parts.length >= 3) {
    // For "Apple Apple scab" -> "Apple___Apple_scab"
    const reconstructed = parts[0] + '___' + parts.slice(1).join('_');
    
    treatment = diseaseTreatments[reconstructed as keyof typeof diseaseTreatments];
    
    if (treatment) {
      return treatment;
    }
  }
  
  // Fallback: try the exact key that we know exists
  if (normalizedSpaces.toLowerCase() === 'apple apple scab') {
    return diseaseTreatments['Apple___Apple_scab'];
  }
  
  return null;
};

// Helper function to get severity color
export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'none':
      return 'text-green-600 bg-green-100';
    case 'moderate':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'very high':
    case 'very high (fatal)':
      return 'text-red-800 bg-red-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};