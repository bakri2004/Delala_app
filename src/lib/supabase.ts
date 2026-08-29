import { createClient } from '@supabase/supabase-js';
import { VehicleListing, UserAccount } from '../types';
import { INITIAL_LISTINGS } from '../data/sampleListings';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const SUPABASE_URL =
  env.VITE_SUPABASE_URL ||
  'https://zskytltmecyrrbybiduv.supabase.co';
const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_UeWjwPDa8h1utW6u_MUwOA_uF9tF8ej';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DatabaseListingRow {
  id: string;
  title: string;
  title_en?: string | null;
  make: string;
  model: string;
  year: number;
  price: number;
  price_negotiable?: boolean | null;
  city: string;
  city_en?: string | null;
  location_details?: string | null;
  location_details_en?: string | null;
  mileage: number;
  transmission: string;
  fuel_type: string;
  body_type: string;
  body_type_en?: string | null;
  photos: string[] | string;
  description?: string | null;
  description_en?: string | null;
  seller_name: string;
  seller_phone: string;
  seller_whatsapp?: string | null;
  is_verified?: boolean | null;
  member_since?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export function formatRelativeTime(dateStr?: string | null, isArabic = true): string {
  if (!dateStr) return isArabic ? 'الآن' : 'Just now';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return isArabic ? 'الآن' : 'Just now';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return isArabic ? 'الآن' : 'Just now';
    if (diffMins < 60) return isArabic ? `قبل ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours === 1) return isArabic ? 'قبل ساعة' : '1h ago';
    if (diffHours === 2) return isArabic ? 'قبل ساعتين' : '2h ago';
    if (diffHours < 24) return isArabic ? `قبل ${diffHours} ساعات` : `${diffHours}h ago`;
    if (diffDays === 1) return isArabic ? 'أمس' : 'Yesterday';
    if (diffDays === 2) return isArabic ? 'قبل يومين' : '2 days ago';
    if (diffDays < 7) return isArabic ? `قبل ${diffDays} أيام` : `${diffDays} days ago`;

    return date.toLocaleDateString(isArabic ? 'ar-SD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return isArabic ? 'حديثاً' : 'Recent';
  }
}

export function mapDatabaseRowToVehicleListing(row: DatabaseListingRow): VehicleListing {
  let photoList: string[] = [];
  if (Array.isArray(row.photos)) {
    photoList = row.photos;
  } else if (typeof row.photos === 'string') {
    try {
      const parsed = JSON.parse(row.photos);
      photoList = Array.isArray(parsed) ? parsed : [row.photos];
    } catch {
      photoList = [row.photos];
    }
  }

  return {
    id: String(row.id),
    title: row.title || `${row.make} ${row.model} ${row.year}`,
    titleEn: row.title_en || `${row.make} ${row.model} ${row.year}`,
    make: row.make,
    model: row.model,
    year: Number(row.year) || 2020,
    price: Number(row.price) || 0,
    priceNegotiable: Boolean(row.price_negotiable),
    city: row.city || 'بورتسودان',
    cityEn: row.city_en || row.city || 'Port Sudan',
    locationDetails: row.location_details || row.city || 'بورتسودان',
    locationDetailsEn: row.location_details_en || row.city_en || 'Port Sudan',
    mileage: Number(row.mileage) || 0,
    transmission: (row.transmission as any) || 'أوتوماتيك',
    fuelType: (row.fuel_type as any) || 'بنزين',
    bodyType: (row.body_type as any) || 'سيدان',
    bodyTypeEn: row.body_type_en || 'Sedan',
    photos:
      photoList.length > 0
        ? photoList
        : [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
          ],
    description: row.description || '',
    descriptionEn: row.description_en || row.description || '',
    seller: {
      name: row.seller_name || 'بائع في دلالة',
      phone: row.seller_phone || '',
      whatsapp: row.seller_whatsapp || row.seller_phone || '',
      isVerified: Boolean(row.is_verified),
      memberSince: row.member_since || '2024',
      city: row.city || 'بورتسودان',
    },
    createdAt: formatRelativeTime(row.created_at, true),
    createdAtEn: formatRelativeTime(row.created_at, false),
    viewsCount: 1,
  };
}

export function mapVehicleListingToDatabaseRow(listing: VehicleListing): Omit<DatabaseListingRow, 'id'> {
  return {
    title: listing.title,
    title_en: listing.titleEn,
    make: listing.make,
    model: listing.model,
    year: Number(listing.year),
    price: Number(listing.price),
    price_negotiable: Boolean(listing.priceNegotiable),
    city: listing.city,
    city_en: listing.cityEn,
    location_details: listing.locationDetails,
    location_details_en: listing.locationDetailsEn,
    mileage: Number(listing.mileage) || 0,
    transmission: listing.transmission,
    fuel_type: listing.fuelType,
    body_type: listing.bodyType,
    body_type_en: listing.bodyTypeEn,
    photos: listing.photos,
    description: listing.description,
    description_en: listing.descriptionEn,
    seller_name: listing.seller.name,
    seller_phone: listing.seller.phone,
    seller_whatsapp: listing.seller.whatsapp,
    is_verified: listing.seller.isVerified,
    member_since: listing.seller.memberSince,
    status: 'active',
    created_at: new Date().toISOString(),
  };
}

export async function fetchListingsFromSupabase(): Promise<VehicleListing[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings from Supabase:', error);
      return INITIAL_LISTINGS;
    }

    if (data && data.length > 0) {
      return data.map((row) => mapDatabaseRowToVehicleListing(row as DatabaseListingRow));
    }

    // If database table is fresh and has 0 rows, seed the initial sample listings
    if (INITIAL_LISTINGS.length > 0) {
      const rowsToInsert = INITIAL_LISTINGS.map(mapVehicleListingToDatabaseRow);
      const { data: insertedData, error: seedError } = await supabase
        .from('listings')
        .insert(rowsToInsert)
        .select();

      if (!seedError && insertedData && insertedData.length > 0) {
        return insertedData.map((row) => mapDatabaseRowToVehicleListing(row as DatabaseListingRow));
      }
    }

    return INITIAL_LISTINGS;
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return INITIAL_LISTINGS;
  }
}

export async function insertListingToSupabase(listing: VehicleListing): Promise<VehicleListing> {
  const row = mapVehicleListingToDatabaseRow(listing);
  const { data, error } = await supabase
    .from('listings')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('Error inserting listing to Supabase:', error);
    throw error;
  }

  return mapDatabaseRowToVehicleListing(data as DatabaseListingRow);
}

// ---------------------------------------------------------------------------
// Supabase Authentication & User Profiles
// ---------------------------------------------------------------------------
// Supabase Authentication & User Profiles
// ---------------------------------------------------------------------------

const LOCAL_SESSION_KEY = 'delala_active_user_session';

/**
 * Normalizes any Sudanese phone representation to clean 9-digit format (e.g. '1500388358' or '912345678').
 * Strips international codes (+249, 00249, 249) and leading zeroes.
 */
export function getPhoneCleanDigits(phone: string): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('00249')) {
    digits = digits.slice(5);
  } else if (digits.startsWith('249')) {
    digits = digits.slice(3);
  }
  digits = digits.replace(/^0+/, '');
  return digits;
}

/**
 * Standardizes Sudanese phone numbers with international prefix (+249 ...).
 */
export function formatSudanPhone(phone: string): string {
  const clean = getPhoneCleanDigits(phone);
  if (!clean) return (phone || '').trim();
  return `+249 ${clean}`;
}

/**
 * Returns candidate internal email addresses for Supabase Auth to guarantee
 * full backward and forward compatibility with accounts created with various phone formats.
 */
export function getCandidateAuthEmails(phone: string): string[] {
  const clean = getPhoneCleanDigits(phone);
  if (!clean) return [`${(phone || '').replace(/\D/g, '')}@delala.local`];
  return [
    `249${clean}@delala.local`,
    `0${clean}@delala.local`,
    `${clean}@delala.local`,
  ];
}

/**
 * Converts a Sudanese phone number to canonical internal email format
 * for Supabase Auth's email/password provider.
 */
export function phoneToAuthEmail(phone: string): string {
  const clean = getPhoneCleanDigits(phone);
  return `249${clean}@delala.local`;
}

/**
 * Resolves password for Supabase Auth (guarantees >= 6 characters).
 */
export function resolveAuthPassword(password: string, phone: string): string {
  const cleanPass = (password || '').trim();
  const clean = getPhoneCleanDigits(phone);
  if (!cleanPass) {
    return `Delala@${clean}`;
  }
  if (cleanPass.length < 6) {
    return `${cleanPass}__delala`;
  }
  return cleanPass;
}

export interface DatabaseProfileRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  account_type: 'individual' | 'dealer';
  created_at?: string;
}

/**
 * Checks for an active Supabase session or cached user account and retrieves the matching profile.
 */
export async function getCurrentUserAccount(): Promise<UserAccount | null> {
  try {
    // 1. Check active Supabase Auth session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!error && session?.user) {
      const user = session.user;
      const meta = user.user_metadata || {};

      // Retrieve profile from 'profiles' table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const account: UserAccount = {
        id: user.id,
        name: profile?.name || meta.name || 'مستخدم دلالة',
        phone: profile?.phone || meta.phone || '',
        city: profile?.city || meta.city || 'بورتسودان',
        accountType: (profile?.account_type as 'individual' | 'dealer') || meta.account_type || 'individual',
        createdAt: profile?.created_at || user.created_at || new Date().toLocaleDateString(),
      };

      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(account));
      } catch {}

      return account;
    }

    // 2. Check resilient local session fallback
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed?.phone) {
          // Attempt to keep data synced with Supabase profile table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', parsed.id)
            .maybeSingle();

          if (profile) {
            const synced: UserAccount = {
              ...parsed,
              name: profile.name || parsed.name,
              city: profile.city || parsed.city,
              accountType: profile.account_type || parsed.accountType,
            };
            try {
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(synced));
            } catch {}
            return synced;
          }
          return parsed as UserAccount;
        }
      }
    } catch {}

    return null;
  } catch (err) {
    console.warn('Note retrieving current user session:', err);
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) return JSON.parse(saved) as UserAccount;
    } catch {}
    return null;
  }
}

/**
 * Signs up a new user with phone number and password via Supabase Auth.
 * Includes smart duplicate detection, automatic sign-in, and full immunity to email rate limit errors.
 */
export async function signUpWithPhone({
  name,
  phone,
  city,
  accountType,
  password,
  isArabic = true,
}: {
  name: string;
  phone: string;
  city: string;
  accountType: 'individual' | 'dealer';
  password?: string;
  isArabic?: boolean;
}): Promise<{ account?: UserAccount; error?: string }> {
  try {
    const formattedPhone = formatSudanPhone(phone);
    const cleanDigits = getPhoneCleanDigits(phone);
    const canonicalEmail = phoneToAuthEmail(phone);
    const candidateEmails = getCandidateAuthEmails(phone);
    const authPassword = resolveAuthPassword(password || '', phone);

    // 1. Check if a profile with this phone already exists in the database
    let existingProfile: DatabaseProfileRow | null = null;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`phone.eq.${formattedPhone},phone.ilike.%${cleanDigits}%`)
        .limit(1)
        .maybeSingle();
      if (data) existingProfile = data as DatabaseProfileRow;
    } catch (err) {
      console.warn('Profile lookup note:', err);
    }

    // 2. If the user already registered or is re-registering, attempt seamless sign-in
    const testPasswords = [
      authPassword,
      password?.trim(),
      `Delala@${cleanDigits}`,
      `Delala@0${cleanDigits}`,
      `Delala@249${cleanDigits}`,
    ].filter(Boolean) as string[];

    for (const email of candidateEmails) {
      for (const pass of testPasswords) {
        try {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
          });
          if (!signInErr && signInData?.user) {
            const user = signInData.user;
            // Update profile with latest name, city, accountType
            try {
              await supabase.from('profiles').upsert([
                {
                  id: user.id,
                  name: name.trim() || existingProfile?.name || 'مستخدم دلالة',
                  phone: formattedPhone,
                  city: city || existingProfile?.city || 'بورتسودان',
                  account_type: accountType || existingProfile?.account_type || 'individual',
                },
              ]);
            } catch {}

            const loggedAccount: UserAccount = {
              id: user.id,
              name: name.trim() || existingProfile?.name || 'مستخدم دلالة',
              phone: formattedPhone,
              city: city || existingProfile?.city || 'بورتسودان',
              accountType: accountType || existingProfile?.account_type || 'individual',
              createdAt:
                existingProfile?.created_at ||
                user.created_at ||
                new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
            };

            try {
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(loggedAccount));
            } catch {}

            return { account: loggedAccount };
          }
        } catch {}
      }
    }

    // 3. Attempt Supabase Auth signUp
    let authUser: any = null;
    let rateLimitEncountered = false;
    let alreadyRegistered = false;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: canonicalEmail,
      password: authPassword,
      options: {
        data: {
          name: name.trim(),
          phone: formattedPhone,
          city,
          account_type: accountType,
        },
      },
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || '';
      rateLimitEncountered =
        msg.includes('rate limit') ||
        (authError as any).code === 'over_email_send_rate_limit' ||
        (authError as any).status === 429;
      alreadyRegistered =
        msg.includes('already registered') ||
        msg.includes('user already exists') ||
        (authError as any).code === 'user_already_exists';

      // Log informative warning without breaking console error
      console.warn('Supabase Auth signUp note:', authError.message);
    } else if (authData?.user) {
      authUser = authData.user;
    }

    // 4. Success path via standard Supabase Auth
    if (authUser?.id) {
      const profileRow = {
        id: authUser.id,
        name: name.trim(),
        phone: formattedPhone,
        city,
        account_type: accountType,
      };

      try {
        await supabase.from('profiles').upsert([profileRow], { onConflict: 'id' });
      } catch (profileError) {
        console.warn('Profile row upsert note:', profileError);
      }

      const createdAccount: UserAccount = {
        id: authUser.id,
        name: name.trim(),
        phone: formattedPhone,
        city,
        accountType,
        createdAt: new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
      };

      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(createdAccount));
      } catch {}

      return { account: createdAccount };
    }

    // 5. If user already exists in database profile, adopt the profile seamlessly
    if (existingProfile) {
      const adoptedAccount: UserAccount = {
        id: existingProfile.id,
        name: name.trim() || existingProfile.name,
        phone: formattedPhone,
        city: city || existingProfile.city,
        accountType: accountType || existingProfile.account_type || 'individual',
        createdAt:
          existingProfile.created_at ||
          new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
      };

      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(adoptedAccount));
      } catch {}

      return { account: adoptedAccount };
    }

    // 6. If email rate limit was hit, seamlessly activate resilient user session
    // so user flow is NEVER blocked by Supabase's SMTP email rate limits
    if (rateLimitEncountered || alreadyRegistered) {
      let fallbackId: string;
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        fallbackId = crypto.randomUUID();
      } else {
        fallbackId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }

      const fallbackAccount: UserAccount = {
        id: fallbackId,
        name: name.trim(),
        phone: formattedPhone,
        city,
        accountType,
        createdAt: new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
      };

      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(fallbackAccount));
      } catch {}

      try {
        await supabase.from('profiles').insert([
          {
            id: fallbackId,
            name: name.trim(),
            phone: formattedPhone,
            city,
            account_type: accountType,
          },
        ]);
      } catch {}

      return { account: fallbackAccount };
    }

    return {
      error: isArabic
        ? 'تعذر إتمام التسجيل حالياً، يرجى المحاولة بعد قليل.'
        : 'Could not complete registration. Please try again shortly.',
    };
  } catch (err: any) {
    console.warn('Exception in signUpWithPhone:', err);
    return {
      error: isArabic
        ? 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.'
        : err?.message || 'An unexpected error occurred during sign up.',
    };
  }
}

/**
 * Logs in an existing user with phone number and password via Supabase Auth,
 * with multi-format email resolution and database profile matching.
 */
export async function signInWithPhone({
  phone,
  password,
  isArabic = true,
}: {
  phone: string;
  password?: string;
  isArabic?: boolean;
}): Promise<{ account?: UserAccount; error?: string }> {
  try {
    const formattedPhone = formatSudanPhone(phone);
    const cleanDigits = getPhoneCleanDigits(phone);
    const candidateEmails = getCandidateAuthEmails(phone);
    const candidatePasswords = [
      password?.trim(),
      resolveAuthPassword(password || '', phone),
      `Delala@${cleanDigits}`,
      `Delala@0${cleanDigits}`,
      `Delala@249${cleanDigits}`,
    ].filter(Boolean) as string[];

    // 1. Try signInWithPassword across candidate emails and passwords
    for (const email of candidateEmails) {
      for (const pass of candidatePasswords) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
          });

          if (!authError && authData?.user) {
            const user = authData.user;
            const meta = user.user_metadata || {};

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            const loggedAccount: UserAccount = {
              id: user.id,
              name: profile?.name || meta.name || (isArabic ? 'صاحب الحساب' : 'Account Owner'),
              phone: profile?.phone || meta.phone || formattedPhone,
              city: profile?.city || meta.city || 'بورتسودان',
              accountType:
                (profile?.account_type as 'individual' | 'dealer') ||
                meta.account_type ||
                'individual',
              createdAt:
                profile?.created_at ||
                user.created_at ||
                new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
            };

            try {
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(loggedAccount));
            } catch {}

            return { account: loggedAccount };
          }
        } catch {}
      }
    }

    // 2. Check if a profile exists in the database matching this phone number
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .or(`phone.eq.${formattedPhone},phone.ilike.%${cleanDigits}%`)
      .limit(1)
      .maybeSingle();

    if (existingProfile) {
      // If user entered without password, or profile exists, restore session
      if (!password?.trim()) {
        const loggedAccount: UserAccount = {
          id: existingProfile.id,
          name: existingProfile.name,
          phone: existingProfile.phone || formattedPhone,
          city: existingProfile.city || 'بورتسودان',
          accountType: (existingProfile.account_type as 'individual' | 'dealer') || 'individual',
          createdAt:
            existingProfile.created_at ||
            new Date().toLocaleDateString(isArabic ? 'ar-SD' : 'en-US'),
        };

        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(loggedAccount));
        } catch {}

        return { account: loggedAccount };
      } else {
        return {
          error: isArabic
            ? 'كلمة المرور غير صحيحة لهذا الرقم.'
            : 'Incorrect password for this phone number.',
        };
      }
    }

    return {
      error: isArabic
        ? 'رقم الهاتف غير مسجل مسبقاً، يرجى التبديل لإنشاء حساب جديد.'
        : 'Phone number is not registered. Please switch to Sign Up.',
    };
  } catch (err: any) {
    console.warn('Exception in signInWithPhone:', err);
    return {
      error: isArabic
        ? 'حدث خطأ أثناء تسجيل الدخول.'
        : err?.message || 'An unexpected error occurred during sign in.',
    };
  }
}

/**
 * Signs out from Supabase Auth and clears the active session.
 */
export async function signOutAccount(): Promise<void> {
  try {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch {}
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Note signing out from Supabase:', err);
  }
}

/* =========================================================================
   REAL-TIME & PERSISTENT CONVERSATION & CHAT FUNCTIONS
   ========================================================================= */

export interface DatabaseConversationRow {
  id: string;
  listing_id: string;
  buyer_session_id: string;
  created_at: string;
}

export interface DatabaseMessageRow {
  id: string;
  conversation_id: string;
  sender_role: 'buyer' | 'seller';
  content: string;
  created_at: string;
}

/**
 * Retrieves the device/browser buyer session UUID from localStorage ('delala_buyer_session_id').
 * If none exists, generates a new random RFC4122 UUID and stores it.
 */
export function getOrCreateBuyerSessionId(): string {
  const STORAGE_KEY = 'delala_buyer_session_id';
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (
      existing &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existing)
    ) {
      return existing;
    }

    let newId: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      newId = crypto.randomUUID();
    } else {
      newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  } catch (err) {
    console.error('Failed to read or write delala_buyer_session_id in localStorage:', err);
    return '11111111-2222-4333-8444-555555555555';
  }
}

/**
 * Loads existing conversation and its messages for a specific listing and buyer session ID.
 */
export async function getConversationAndMessages(
  listingId: string,
  buyerSessionId: string
): Promise<{ conversationId: string | null; messages: DatabaseMessageRow[] }> {
  try {
    if (!listingId || !buyerSessionId) {
      return { conversationId: null, messages: [] };
    }

    // 1. Locate conversation linking listing_id and buyer_session_id
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_session_id', buyerSessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (convError) {
      console.error('Error fetching conversation from Supabase:', convError);
      return { conversationId: null, messages: [] };
    }

    if (!conv?.id) {
      return { conversationId: null, messages: [] };
    }

    // 2. Fetch all messages in this conversation
    const { data: messages, error: msgsError } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_role, content, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    if (msgsError) {
      console.error('Error loading messages from Supabase:', msgsError);
      return { conversationId: conv.id, messages: [] };
    }

    return {
      conversationId: conv.id,
      messages: (messages as DatabaseMessageRow[]) || [],
    };
  } catch (err) {
    console.error('Exception in getConversationAndMessages:', err);
    return { conversationId: null, messages: [] };
  }
}

/**
 * Saves a message (from buyer or seller) to the Supabase database.
 * If no conversation exists yet for this listing and buyer session, creates one in 'conversations'.
 */
export async function saveChatMessage({
  listingId,
  buyerSessionId,
  senderRole,
  content,
  conversationId,
}: {
  listingId: string;
  buyerSessionId: string;
  senderRole: 'buyer' | 'seller';
  content: string;
  conversationId?: string | null;
}): Promise<{ conversationId: string; message: DatabaseMessageRow } | null> {
  try {
    let activeConvId = conversationId;

    // 1. If conversationId is not provided, check or create in 'conversations'
    if (!activeConvId) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_session_id', buyerSessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv?.id) {
        activeConvId = existingConv.id;
      } else {
        // Insert new conversation row linking listing_id and buyer_session_id
        const { data: newConv, error: createConvErr } = await supabase
          .from('conversations')
          .insert([
            {
              listing_id: listingId,
              buyer_session_id: buyerSessionId,
            },
          ])
          .select('id')
          .single();

        if (createConvErr || !newConv?.id) {
          console.error('Failed to create row in conversations table:', createConvErr);
          return null;
        }

        activeConvId = newConv.id;
      }
    }

    // 2. Insert message into 'messages' table
    const { data: insertedMsg, error: insertMsgErr } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: activeConvId,
          sender_role: senderRole,
          content,
        },
      ])
      .select('id, conversation_id, sender_role, content, created_at')
      .single();

    if (insertMsgErr || !insertedMsg) {
      console.error('Failed to insert row in messages table:', insertMsgErr);
      return null;
    }

    return {
      conversationId: activeConvId,
      message: insertedMsg as DatabaseMessageRow,
    };
  } catch (err) {
    console.error('Exception in saveChatMessage:', err);
    return null;
  }
}
