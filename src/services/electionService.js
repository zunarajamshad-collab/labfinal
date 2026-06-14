import { isSupabaseConfigured, supabaseConfig } from '../lib/supabaseConfig'

export async function supabaseRestRequest(path, options = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function getSupabaseHeaders(accessToken) {
  return {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${accessToken || supabaseConfig.anonKey}`,
    'Content-Type': 'application/json',
  }
}

export async function signUpWithSupabase({ email, password, name, phone, role }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const response = await fetch(`${supabaseConfig.url}/auth/v1/signup`, {
    method: 'POST',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: name,
        phone,
        role: role === 'admin' ? 'super_admin' : role === 'creator' ? 'election_creator' : 'voter',
      },
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.msg || payload.message || 'Signup failed.')
  }

  return payload
}

export async function loginWithSupabase({ email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const response = await fetch(`${supabaseConfig.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.msg || payload.message || 'Login failed.')
  }

  return payload
}

export async function sendPasswordReset({ email }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const response = await fetch(`${supabaseConfig.url}/auth/v1/recover`, {
    method: 'POST',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ email }),
  })

  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.msg || payload?.message || 'Password reset failed.')
  }

  return payload
}

export async function createCreatorRequest(request, session) {
  if (!session?.access_token || !session?.user?.id) {
    throw new Error('Login is required before saving creator request to Supabase.')
  }

  return supabaseRestRequest('creator_requests', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      user_id: session.user.id,
      purpose: request.purpose,
      organization: request.organization,
      email: request.email,
      phone: request.phone,
      status: 'pending',
    }),
  })
}

export function getBackendStatus() {
  return isSupabaseConfigured
    ? 'Supabase environment variables are configured.'
    : 'Demo mode: add Supabase environment variables to enable live backend calls.'
}
