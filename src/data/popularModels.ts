export interface ModelSuggestion {
  nameAr: string;
  nameEn: string;
  aliases?: string[];
}

export const POPULAR_MODELS_BY_MAKE: Record<string, ModelSuggestion[]> = {
  تويوتا: [
    { nameAr: 'كورولا', nameEn: 'Corolla', aliases: ['كرولا', 'corolla'] },
    { nameAr: 'هايلوكس', nameEn: 'Hilux', aliases: ['هايلكس', 'بوكس', 'دبل كابين', 'hilux'] },
    { nameAr: 'لاندكروزر', nameEn: 'Land Cruiser', aliases: ['لاند كروزر', 'استيشن', 'v8', 'land cruiser'] },
    { nameAr: 'برادو', nameEn: 'Prado', aliases: ['لاندكروزر برادو', 'prado'] },
    { nameAr: 'يارس', nameEn: 'Yaris', aliases: ['ياريس', 'yaris'] },
    { nameAr: 'كامري', nameEn: 'Camry', aliases: ['camry'] },
    { nameAr: 'فورتشنر', nameEn: 'Fortuner', aliases: ['فورشنر', 'fortuner'] },
    { nameAr: 'راف 4', nameEn: 'RAV4', aliases: ['راف فور', 'rav4', 'rav 4'] },
    { nameAr: 'هايس', nameEn: 'HiAce', aliases: ['باص', 'شريحة', 'هاي اس', 'hiace'] },
    { nameAr: 'أفلون', nameEn: 'Avalon', aliases: ['افلون', 'avalon'] },
    { nameAr: 'كراون', nameEn: 'Crown', aliases: ['crown'] },
    { nameAr: 'رش', nameEn: 'Rush', aliases: ['راش', 'rush'] },
    { nameAr: 'أوريس', nameEn: 'Auris', aliases: ['اوريس', 'auris'] },
    { nameAr: 'إنوفا', nameEn: 'Innova', aliases: ['انوفا', 'innova'] },
    { nameAr: 'لاندكروزر 70 (شاص)', nameEn: 'Land Cruiser 70', aliases: ['شاص', 'كروزر بيك اب', 'land cruiser 70'] },
  ],
  هيونداي: [
    { nameAr: 'أكسنت', nameEn: 'Accent', aliases: ['اكسنت', 'دبدوب', 'مضلع', 'accent'] },
    { nameAr: 'إلنترا', nameEn: 'Elantra', aliases: ['النترا', 'elantra'] },
    { nameAr: 'توسان', nameEn: 'Tucson', aliases: ['تكسون', 'tucson'] },
    { nameAr: 'سنتافي', nameEn: 'Santa Fe', aliases: ['سانتافي', 'santa fe'] },
    { nameAr: 'سوناتا', nameEn: 'Sonata', aliases: ['sonata'] },
    { nameAr: 'H100', nameEn: 'H100', aliases: ['اتش 100', 'شريحة', 'بورتر', 'h100', 'h-100'] },
    { nameAr: 'H1', nameEn: 'H1', aliases: ['اتش ون', 'ستاركس', 'starex', 'h1'] },
    { nameAr: 'فيرنا', nameEn: 'Verna', aliases: ['verna'] },
    { nameAr: 'كريتا', nameEn: 'Creta', aliases: ['creta'] },
    { nameAr: 'ستاريا', nameEn: 'Staria', aliases: ['staria'] },
    { nameAr: 'أفانتي', nameEn: 'Avante', aliases: ['افانتي', 'avante'] },
    { nameAr: 'كليك', nameEn: 'Click', aliases: ['click', 'جيتز', 'getz'] },
    { nameAr: 'أتوس', nameEn: 'Atos', aliases: ['اتوس', 'atos'] },
    { nameAr: 'أي 10', nameEn: 'i10', aliases: ['i10', 'جراند i10'] },
    { nameAr: 'أي 20', nameEn: 'i20', aliases: ['i20'] },
  ],
  ميتسوبيشي: [
    { nameAr: 'لانسر', nameEn: 'Lancer', aliases: ['لانسر قرش', 'lancer'] },
    { nameAr: 'باجيرو', nameEn: 'Pajero', aliases: ['pajero'] },
    { nameAr: 'L200', nameEn: 'L200', aliases: ['ال 200', 'بيك اب', 'بوكس', 'l200'] },
    { nameAr: 'كانتر', nameEn: 'Canter', aliases: ['دفار', 'شاحنة', 'canter'] },
    { nameAr: 'آوتلاندر', nameEn: 'Outlander', aliases: ['اوتلاندر', 'outlander'] },
    { nameAr: 'إكليبس كروس', nameEn: 'Eclipse Cross', aliases: ['اكليبس', 'eclipse'] },
    { nameAr: 'ASX', nameEn: 'ASX', aliases: ['asx'] },
    { nameAr: 'ميراج', nameEn: 'Mirage', aliases: ['mirage', 'اتراج', 'attrage'] },
    { nameAr: 'سبيس واجون', nameEn: 'Space Wagon', aliases: ['space wagon'] },
  ],
  نيسان: [
    { nameAr: 'صني', nameEn: 'Sunny', aliases: ['sunny'] },
    { nameAr: 'باترول', nameEn: 'Patrol', aliases: ['بطل الدروب', 'patrol'] },
    { nameAr: 'نافارا', nameEn: 'Navara', aliases: ['navara', 'بيك اب'] },
    { nameAr: 'ددسن', nameEn: 'Datsun Pickup', aliases: ['بيك اب', 'datsun'] },
    { nameAr: 'إكس تريل', nameEn: 'X-Trail', aliases: ['اكس تريل', 'xtrail', 'x-trail'] },
    { nameAr: 'باثفايندر', nameEn: 'Pathfinder', aliases: ['pathfinder'] },
    { nameAr: 'تيدا', nameEn: 'Tiida', aliases: ['tiida'] },
    { nameAr: 'التيما', nameEn: 'Altima', aliases: ['ألتيما', 'altima'] },
    { nameAr: 'كاشكاي', nameEn: 'Qashqai', aliases: ['qashqai'] },
    { nameAr: 'ميكرا', nameEn: 'Micra', aliases: ['micra', 'مارتش', 'march'] },
    { nameAr: 'أورفان', nameEn: 'Urvan', aliases: ['باص', 'urvan'] },
  ],
  كيا: [
    { nameAr: 'سيراتو', nameEn: 'Cerato', aliases: ['cerato', 'فورتي', 'forte'] },
    { nameAr: 'سبورتاج', nameEn: 'Sportage', aliases: ['sportage'] },
    { nameAr: 'بيكانتو', nameEn: 'Picanto', aliases: ['picanto', 'مورنينغ', 'morning'] },
    { nameAr: 'ريو', nameEn: 'Rio', aliases: ['rio'] },
    { nameAr: 'سورينتو', nameEn: 'Sorento', aliases: ['sorento'] },
    { nameAr: 'K5', nameEn: 'K5', aliases: ['كي فايف', 'k5', 'أوبتيما', 'optima'] },
    { nameAr: 'كارينز', nameEn: 'Carens', aliases: ['carens'] },
    { nameAr: 'بونجو', nameEn: 'Bongo', aliases: ['bongo', 'نقل', 'شاحنة خفيفة'] },
    { nameAr: 'كادينزا', nameEn: 'Cadenza', aliases: ['cadenza', 'K8'] },
    { nameAr: 'سيلتوس', nameEn: 'Seltos', aliases: ['seltos'] },
    { nameAr: 'بيجاس', nameEn: 'Pegas', aliases: ['pegas'] },
  ],
  سوزوكي: [
    { nameAr: 'سويفت', nameEn: 'Swift', aliases: ['swift'] },
    { nameAr: 'ألتو', nameEn: 'Alto', aliases: ['التو', 'alto'] },
    { nameAr: 'ديزاير', nameEn: 'Dzire', aliases: ['سويفت ديزاير', 'dzire'] },
    { nameAr: 'سياز', nameEn: 'Ciaz', aliases: ['ciaz'] },
    { nameAr: 'جيمني', nameEn: 'Jimny', aliases: ['جمني', 'jimny'] },
    { nameAr: 'فيتارا', nameEn: 'Vitara', aliases: ['جراند فيتارا', 'vitara'] },
    { nameAr: 'إرتيجا', nameEn: 'Ertiga', aliases: ['ارتيجا', 'ertiga'] },
    { nameAr: 'بالينو', nameEn: 'Baleno', aliases: ['baleno'] },
    { nameAr: 'كاري', nameEn: 'Carry', aliases: ['carry', 'بيك اب'] },
    { nameAr: 'سيليريو', nameEn: 'Celerio', aliases: ['celerio'] },
  ],
  إيسوزو: [
    { nameAr: 'ديماكس', nameEn: 'D-Max', aliases: ['دي ماكس', 'dmax', 'd-max', 'بوكس'] },
    { nameAr: 'جامبو', nameEn: 'Jumbo', aliases: ['دفار', 'شاحنة', 'jumbo', 'npr', 'elf'] },
    { nameAr: 'تروبر', nameEn: 'Trooper', aliases: ['trooper'] },
    { nameAr: 'MU-X', nameEn: 'MU-X', aliases: ['ام يو اكس', 'mux', 'mu-x'] },
    { nameAr: 'F-Series', nameEn: 'Forward', aliases: ['فورورد', 'f series'] },
  ],
  'مرسيدس بنز': [
    { nameAr: 'C-Class', nameEn: 'C-Class', aliases: ['سي كلاس', 'c200', 'c180', 'c300'] },
    { nameAr: 'E-Class', nameEn: 'E-Class', aliases: ['اي كلاس', 'e200', 'e300', 'e350'] },
    { nameAr: 'S-Class', nameEn: 'S-Class', aliases: ['اس كلاس', 's500', 's400'] },
    { nameAr: 'G-Class', nameEn: 'G-Class', aliases: ['جي كلاس', 'g wagon', 'g63'] },
    { nameAr: 'GLE', nameEn: 'GLE', aliases: ['gle'] },
    { nameAr: 'GLC', nameEn: 'GLC', aliases: ['glc'] },
    { nameAr: 'CLA', nameEn: 'CLA', aliases: ['cla'] },
  ],
  'بي إم دبليو': [
    { nameAr: 'الفئة الثالثة (3 Series)', nameEn: '3 Series', aliases: ['3 series', '320i', '330i'] },
    { nameAr: 'الفئة الخامسة (5 Series)', nameEn: '5 Series', aliases: ['5 series', '520i', '530i'] },
    { nameAr: 'الفئة السابعة (7 Series)', nameEn: '7 Series', aliases: ['7 series', '740i', '750i'] },
    { nameAr: 'X5', nameEn: 'X5', aliases: ['اكس 5', 'x5'] },
    { nameAr: 'X6', nameEn: 'X6', aliases: ['اكس 6', 'x6'] },
    { nameAr: 'X3', nameEn: 'X3', aliases: ['اكس 3', 'x3'] },
  ],
  هوندا: [
    { nameAr: 'سيفيك', nameEn: 'Civic', aliases: ['civic'] },
    { nameAr: 'أكورد', nameEn: 'Accord', aliases: ['اكورد', 'accord'] },
    { nameAr: 'CR-V', nameEn: 'CR-V', aliases: ['سي ار في', 'crv', 'cr-v'] },
    { nameAr: 'HR-V', nameEn: 'HR-V', aliases: ['اتش ار في', 'hrv', 'hr-v'] },
    { nameAr: 'سيتي', nameEn: 'City', aliases: ['city'] },
    { nameAr: 'بايلوت', nameEn: 'Pilot', aliases: ['pilot'] },
  ],
  فورد: [
    { nameAr: 'إكسبلورر', nameEn: 'Explorer', aliases: ['اكسبلورر', 'explorer'] },
    { nameAr: 'إف 150', nameEn: 'F-150', aliases: ['f150', 'f-150', 'بيك اب'] },
    { nameAr: 'رينجر', nameEn: 'Ranger', aliases: ['ranger', 'بيك اب'] },
    { nameAr: 'إسكيب', nameEn: 'Escape', aliases: ['اسكيب', 'escape'] },
    { nameAr: 'إيدج', nameEn: 'Edge', aliases: ['ايدج', 'edge'] },
    { nameAr: 'توروس', nameEn: 'Taurus', aliases: ['taurus'] },
    { nameAr: 'إكسبيديشن', nameEn: 'Expedition', aliases: ['اكسبيديشن', 'expedition'] },
  ],
  شيفروليه: [
    { nameAr: 'أوبترا', nameEn: 'Optra', aliases: ['اوبترا', 'optra'] },
    { nameAr: 'كروز', nameEn: 'Cruze', aliases: ['cruze'] },
    { nameAr: 'تاهو', nameEn: 'Tahoe', aliases: ['tahoe'] },
    { nameAr: 'كابتيفا', nameEn: 'Captiva', aliases: ['captiva'] },
    { nameAr: 'سبارك', nameEn: 'Spark', aliases: ['spark'] },
    { nameAr: 'سلفرادو', nameEn: 'Silverado', aliases: ['silverado', 'بيك اب'] },
    { nameAr: 'أفيو', nameEn: 'Aveo', aliases: ['افيو', 'aveo'] },
  ],
  جيلي: [
    { nameAr: 'إمجراند', nameEn: 'Emgrand', aliases: ['امجراند', 'emgrand', 'ec7'] },
    { nameAr: 'كولراي', nameEn: 'Coolray', aliases: ['coolray'] },
    { nameAr: 'أزكارا', nameEn: 'Azkarra', aliases: ['ازكارا', 'azkarra'] },
    { nameAr: 'توجيلا', nameEn: 'Tugella', aliases: ['tugella'] },
    { nameAr: 'مونجارو', nameEn: 'Monjaro', aliases: ['monjaro'] },
  ],
  'إم جي': [
    { nameAr: 'MG 5', nameEn: 'MG 5', aliases: ['ام جي 5', 'mg5'] },
    { nameAr: 'MG 6', nameEn: 'MG 6', aliases: ['ام جي 6', 'mg6'] },
    { nameAr: 'MG ZS', nameEn: 'MG ZS', aliases: ['ام جي زد اس', 'mg zs', 'mgzs'] },
    { nameAr: 'MG RX5', nameEn: 'MG RX5', aliases: ['ام جي ار اكس 5', 'rx5'] },
    { nameAr: 'MG HS', nameEn: 'MG HS', aliases: ['ام جي اتش اس', 'hs'] },
    { nameAr: 'MG ONE', nameEn: 'MG ONE', aliases: ['ام جي ون', 'mg one'] },
    { nameAr: 'MG GT', nameEn: 'MG GT', aliases: ['ام جي جي تي', 'mg gt'] },
  ],
  شيري: [
    { nameAr: 'تيجو 7', nameEn: 'Tiggo 7', aliases: ['tiggo 7', 'تيجو'] },
    { nameAr: 'تيجو 8', nameEn: 'Tiggo 8', aliases: ['tiggo 8'] },
    { nameAr: 'تيجو 4', nameEn: 'Tiggo 4', aliases: ['tiggo 4'] },
    { nameAr: 'أريزو 5', nameEn: 'Arrizo 5', aliases: ['اريزو 5', 'arrizo 5'] },
    { nameAr: 'أريزو 6', nameEn: 'Arrizo 6', aliases: ['اريزو 6', 'arrizo 6'] },
    { nameAr: 'كيو كيو', nameEn: 'QQ', aliases: ['qq'] },
  ],
  'بي واي دي': [
    { nameAr: 'F3', nameEn: 'F3', aliases: ['اف 3', 'f3'] },
    { nameAr: 'هان', nameEn: 'Han', aliases: ['han'] },
    { nameAr: 'تانغ', nameEn: 'Tang', aliases: ['tang'] },
    { nameAr: 'سونغ', nameEn: 'Song', aliases: ['song'] },
    { nameAr: 'أتو 3', nameEn: 'Atto 3', aliases: ['atto 3', 'atto3'] },
  ],
  شانجان: [
    { nameAr: 'CS75', nameEn: 'CS75', aliases: ['cs75', 'cs 75'] },
    { nameAr: 'CS35', nameEn: 'CS35', aliases: ['cs35', 'cs 35'] },
    { nameAr: 'CS85', nameEn: 'CS85', aliases: ['cs85', 'cs 85'] },
    { nameAr: 'CS95', nameEn: 'CS95', aliases: ['cs95', 'cs 95'] },
    { nameAr: 'ألسفن', nameEn: 'Alsvin', aliases: ['السفن', 'alsvin'] },
    { nameAr: 'إيدو', nameEn: 'Eado', aliases: ['ايدو', 'eado'] },
    { nameAr: 'يوني تي (UNI-T)', nameEn: 'UNI-T', aliases: ['uni-t', 'unit'] },
    { nameAr: 'يوني كي (UNI-K)', nameEn: 'UNI-K', aliases: ['uni-k', 'unik'] },
  ],
  هافال: [
    { nameAr: 'H6', nameEn: 'H6', aliases: ['اتش 6', 'h6'] },
    { nameAr: 'جوليان', nameEn: 'Jolion', aliases: ['jolion'] },
    { nameAr: 'H9', nameEn: 'H9', aliases: ['اتش 9', 'h9'] },
    { nameAr: 'دارجو', nameEn: 'Dargo', aliases: ['dargo'] },
  ],
  'لاند روفر': [
    { nameAr: 'ديفندر', nameEn: 'Defender', aliases: ['defender'] },
    { nameAr: 'رينج روفر', nameEn: 'Range Rover', aliases: ['range rover'] },
    { nameAr: 'رينج روفر سبورت', nameEn: 'Range Rover Sport', aliases: ['range rover sport'] },
    { nameAr: 'فيلار', nameEn: 'Velar', aliases: ['velar'] },
    { nameAr: 'ديسكفري', nameEn: 'Discovery', aliases: ['discovery'] },
  ],
};

// Normalize Arabic letters for fuzzy matching (alif, taa marbuta, etc.)
export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove harakat / tashkeel
    .trim();
}

/**
 * Filter suggestions for a given make and query string
 */
export function getModelSuggestionsForMake(
  make: string,
  query: string
): ModelSuggestion[] {
  const models = POPULAR_MODELS_BY_MAKE[make] || [];
  const cleanQuery = normalizeArabic(query);

  if (!cleanQuery) {
    return models.slice(0, 6);
  }

  return models.filter((item) => {
    const normAr = normalizeArabic(item.nameAr);
    const normEn = item.nameEn.toLowerCase();

    if (normAr.includes(cleanQuery) || normEn.includes(cleanQuery)) {
      return true;
    }

    if (item.aliases) {
      return item.aliases.some((alias) =>
        normalizeArabic(alias).includes(cleanQuery)
      );
    }

    return false;
  });
}
