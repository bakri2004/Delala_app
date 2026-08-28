// Format price in Sudanese Pounds (SDG)
export function formatPriceSDG(price: number, isArabic = true): string {
  if (!price && price !== 0) return '';
  
  // Format with commas, e.g. 27,500,000
  const formattedNumber = new Intl.NumberFormat('en-US').format(price);
  
  if (isArabic) {
    // Show both full format and million abbreviation if applicable
    if (price >= 1000000) {
      const millions = (price / 1000000).toLocaleString('en-US', {
        maximumFractionDigits: 1,
      });
      return `${formattedNumber} ج.س (${millions} مليون)`;
    }
    return `${formattedNumber} ج.س`;
  } else {
    if (price >= 1000000) {
      const millions = (price / 1000000).toLocaleString('en-US', {
        maximumFractionDigits: 1,
      });
      return `${formattedNumber} SDG (${millions}M SDG)`;
    }
    return `${formattedNumber} SDG`;
  }
}

// Compact price for cards (clean, large, easily scannable)
export function formatCardPrice(price: number, isArabic = true): string {
  if (!price && price !== 0) return '';
  const formattedNumber = new Intl.NumberFormat('en-US').format(price);
  return isArabic ? `${formattedNumber} ج.س` : `${formattedNumber} SDG`;
}

// Format mileage
export function formatMileage(km: number, isArabic = true): string {
  if (!km && km !== 0) return isArabic ? 'غير محدد' : 'Not specified';
  const formatted = new Intl.NumberFormat('en-US').format(km);
  return isArabic ? `${formatted} كم` : `${formatted} km`;
}

// WhatsApp link generator
export function getWhatsAppUrl(phone: string, title: string, price: number, isArabic = true): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = isArabic
    ? `السلام عليكم، بخصوص إعلانك على منصة دلالة: "${title}" المعروضة بسعر ${new Intl.NumberFormat('en-US').format(price)} ج.س، هل السيارة ما زالت متوفرة؟`
    : `Hello, regarding your listing on Dallala: "${title}" listed for ${new Intl.NumberFormat('en-US').format(price)} SDG, is it still available?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Convert numbers to live Arabic words for Sudanese currency
export function formatArabicPriceInWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return '';

  const parts: string[] = [];

  const billions = Math.floor(amount / 1_000_000_000);
  const remBillions = amount % 1_000_000_000;

  const millions = Math.floor(remBillions / 1_000_000);
  const remMillions = remBillions % 1_000_000;

  const thousands = Math.floor(remMillions / 1_000);
  const units = remMillions % 1_000;

  if (billions > 0) {
    const formattedB = new Intl.NumberFormat('en-US').format(billions);
    parts.push(`${formattedB} مليار`);
  }

  if (millions > 0) {
    const formattedM = new Intl.NumberFormat('en-US').format(millions);
    parts.push(`${formattedM} مليون`);
  }

  if (thousands > 0) {
    const formattedK = new Intl.NumberFormat('en-US').format(thousands);
    parts.push(`${formattedK} ألف`);
  }

  if (units > 0) {
    const formattedU = new Intl.NumberFormat('en-US').format(units);
    parts.push(`${formattedU}`);
  }

  if (parts.length === 0) return '';

  return `= ${parts.join(' و ')} جنيه سوداني`;
}

// English words equivalent
export function formatEnglishPriceInWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return '';

  const parts: string[] = [];

  const billions = Math.floor(amount / 1_000_000_000);
  const remBillions = amount % 1_000_000_000;

  const millions = Math.floor(remBillions / 1_000_000);
  const remMillions = remBillions % 1_000_000;

  const thousands = Math.floor(remMillions / 1_000);
  const units = remMillions % 1_000;

  if (billions > 0) parts.push(`${new Intl.NumberFormat('en-US').format(billions)} Billion`);
  if (millions > 0) parts.push(`${new Intl.NumberFormat('en-US').format(millions)} Million`);
  if (thousands > 0) parts.push(`${new Intl.NumberFormat('en-US').format(thousands)} Thousand`);
  if (units > 0) parts.push(`${new Intl.NumberFormat('en-US').format(units)}`);

  if (parts.length === 0) return '';

  return `= ${parts.join(', ')} SDG`;
}
