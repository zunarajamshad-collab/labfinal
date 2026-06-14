import { useEffect, useMemo, useState } from 'react'
import {
  createCreatorRequest,
  getBackendStatus,
  loginWithSupabase,
  sendPasswordReset,
  signUpWithSupabase,
} from './services/electionService'
import './App.css'

const electionSeed = [
  {
    id: 'student-senate-2026',
    title: 'Student Senate Election 2026',
    category: 'Campus',
    status: 'active',
    description:
      'Choose the student representatives who will lead academic affairs, clubs, and welfare initiatives.',
    organization: 'North Valley University',
    startsAt: '2026-05-19T09:00',
    endsAt: '2026-05-19T18:00',
    registrationDeadline: '2026-05-18T23:59',
    maxVoters: 1000,
    joined: 842,
    eligible: 1000,
    locked: true,
    secretId: 'POLL-A-7821',
    currentUserJoined: true,
    candidates: [
      {
        id: 'amina',
        name: 'Amina Shah',
        designation: 'Computer Science',
        manifesto: 'Transparent budgeting, stronger mentoring, and better lab access.',
        votes: 438,
        color: '#2563eb',
      },
      {
        id: 'daniel',
        name: 'Daniel Reed',
        designation: 'Business School',
        manifesto: 'More student events, sports funding, and mental health support.',
        votes: 314,
        color: '#0f766e',
      },
      {
        id: 'sofia',
        name: 'Sofia Martin',
        designation: 'Law Society',
        manifesto: 'A faster complaint process and inclusive governance forums.',
        votes: 197,
        color: '#b45309',
      },
    ],
  },
  {
    id: 'community-board',
    title: 'Community Board Chairperson',
    category: 'Civic',
    status: 'upcoming',
    description:
      'Registered residents can opt into the verified voter list before the public forum deadline.',
    organization: 'Greenwood Residents Association',
    startsAt: '2026-05-24T10:00',
    endsAt: '2026-05-24T20:00',
    registrationDeadline: '2026-05-21T17:00',
    maxVoters: 600,
    joined: 418,
    eligible: 600,
    locked: false,
    secretId: 'POLL-B-1944',
    currentUserJoined: false,
    candidates: [
      {
        id: 'marcus',
        name: 'Marcus Bell',
        designation: 'Housing Committee',
        manifesto: 'Safer streets, public maintenance tracking, and open budgets.',
        votes: 0,
        color: '#7c3aed',
      },
      {
        id: 'leah',
        name: 'Leah Chen',
        designation: 'Youth Programs',
        manifesto: 'Expanded after-school support and neighborhood volunteering.',
        votes: 0,
        color: '#db2777',
      },
    ],
  },
  {
    id: 'tech-society',
    title: 'Tech Society Executive Council',
    category: 'Organization',
    status: 'completed',
    description:
      'Finalized annual society election with anonymized ballots and locked public results.',
    organization: 'Open Source Tech Society',
    startsAt: '2026-05-10T09:00',
    endsAt: '2026-05-10T17:00',
    registrationDeadline: '2026-05-06T23:59',
    maxVoters: 450,
    joined: 450,
    eligible: 450,
    locked: true,
    secretId: 'POLL-C-4508',
    currentUserJoined: true,
    candidates: [
      {
        id: 'nora',
        name: 'Nora Evans',
        designation: 'Backend Guild',
        manifesto: 'Monthly hack nights and transparent project selection.',
        votes: 233,
        color: '#16a34a',
      },
      {
        id: 'omar',
        name: 'Omar Khan',
        designation: 'Cloud Team',
        manifesto: 'Better workshops, code review circles, and sponsor outreach.',
        votes: 188,
        color: '#ea580c',
      },
    ],
  },
]

const requestSeed = [
  {
    id: 'req-1',
    name: 'Priya Nair',
    email: 'priya@nvuni.edu',
    phone: '+1 555 0192',
    organization: 'North Valley Debate Club',
    purpose: 'Run a verified club officer election for 320 members.',
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Jordan Miles',
    email: 'jordan@greenwood.org',
    phone: '+1 555 0140',
    organization: 'Greenwood Youth Council',
    purpose: 'Host a youth representative poll with secret voter IDs.',
    status: 'pending',
  },
]

const initialAuditLogs = [
  {
    id: 1,
    actor: 'Super Admin',
    action: 'Approved creator account for North Valley University',
    type: 'approval',
    time: '2026-05-19 08:10',
  },
  {
    id: 2,
    actor: 'System',
    action: 'Final voter list frozen for Student Senate Election 2026',
    type: 'lock',
    time: '2026-05-19 08:30',
  },
  {
    id: 3,
    actor: 'Voter',
    action: 'Anonymous vote accepted for Student Senate Election 2026',
    type: 'vote',
    time: '2026-05-19 09:12',
  },
]

const notificationSeed = [
  {
    id: 'mail-1',
    type: 'Approval email',
    recipient: 'creator@nvuni.edu',
    status: 'sent',
    message: 'Creator account approved and dashboard access enabled.',
  },
  {
    id: 'mail-2',
    type: 'Secret ID email',
    recipient: 'voter***@mail.com',
    status: 'queued',
    message: 'Masked poll code will be sent after voter finalization.',
  },
  {
    id: 'mail-3',
    type: 'Election reminder',
    recipient: '842 finalized voters',
    status: 'scheduled',
    message: 'Voting starts today at 9:00 AM.',
  },
]

const authCards = [
  {
    title: 'Email verification',
    detail: 'Supabase Auth confirms email before protected election access.',
  },
  {
    title: 'Forgot password',
    detail: 'Reset links are sent by email with a short expiry window.',
  },
  {
    title: 'Protected routes',
    detail: 'Dashboards are separated for Super Admin, Election Creator, and Voter.',
  },
  {
    title: 'Optional 2FA',
    detail: 'Bonus-ready second factor step for high-risk admin actions.',
  },
]

const modules = [
  'Auth',
  'Admin Approval',
  'Election Creation',
  'Candidate Management',
  'Voter Registration',
  'Secret IDs',
  'Anonymous Voting',
  'Live Results',
  'Audit Logs',
  'Supabase RLS',
]

const roleSummaries = {
  admin: 'Approve creators, supervise locked voter lists, audit overrides, and monitor platform activity.',
  creator: 'Create elections, publish polls, upload candidate details, and start or close voting windows.',
  voter: 'Join open elections, receive a masked secret ID, vote once, and track transparent results.',
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function totalVotes(election) {
  return election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
}

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getPageFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  return hash || 'home'
}

function App() {
  const [page, setPage] = useState(getPageFromHash)
  const [role, setRole] = useState('voter')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [elections, setElections] = useState(electionSeed)
  const [selectedElectionId, setSelectedElectionId] = useState(electionSeed[0].id)
  const [requests, setRequests] = useState(requestSeed)
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs)
  const [secretInput, setSecretInput] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState(electionSeed[0].candidates[0].id)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteMessage, setVoteMessage] = useState('Enter your poll secret ID to unlock the ballot.')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [authMessage, setAuthMessage] = useState('Create an account to request elections or join polls.')
  const [authLoading, setAuthLoading] = useState(false)
  const [sessionEmail, setSessionEmail] = useState('')
  const [supabaseSession, setSupabaseSession] = useState(null)
  const [authForm, setAuthForm] = useState({
    name: 'Ali Voter',
    email: 'ali@example.com',
    phone: '+1 555 0125',
    password: 'SecurePass#2026',
    role: 'voter',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [joinMessage, setJoinMessage] = useState('Accept terms before joining an election.')
  const [waitlistEntries, setWaitlistEntries] = useState(37)
  const [notifications, setNotifications] = useState(notificationSeed)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [securityCode, setSecurityCode] = useState('')
  const [creatorRequestForm, setCreatorRequestForm] = useState({
    name: 'New Creator',
    email: 'creator@example.com',
    phone: '+1 555 0188',
    organization: 'Demo Organization',
    purpose: 'Run a secure online election for verified members.',
  })
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    designation: '',
    manifesto: '',
  })
  const [creatorForm, setCreatorForm] = useState({
    title: '',
    category: 'Campus',
    description: '',
    maxVoters: 250,
    registrationDeadline: '2026-05-27T17:00',
    startsAt: '2026-05-29T09:00',
    endsAt: '2026-05-29T17:00',
  })

  const filteredElections = useMemo(() => {
    return elections.filter((election) => {
      const matchesFilter = filter === 'all' || election.status === filter
      const text = `${election.title} ${election.category} ${election.organization}`.toLowerCase()
      return matchesFilter && text.includes(search.toLowerCase())
    })
  }, [elections, filter, search])

  const selectedElection =
    elections.find((election) => election.id === selectedElectionId) || elections[0]
  const selectedVotes = totalVotes(selectedElection)
  const turnout = Math.round((selectedVotes / selectedElection.eligible) * 100)
  const leadingCandidate = [...selectedElection.candidates].sort((a, b) => b.votes - a.votes)[0]
  const inviteUrl = `https://securevote-demo.vercel.app/elections/${selectedElection.id}`

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  useEffect(() => {
    function handleRouteChange() {
      const nextPage = getPageFromHash()
      setPage(nextPage)
      if (['admin', 'creator', 'voter'].includes(nextPage)) {
        setRole(nextPage === 'admin' ? 'admin' : nextPage)
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    handleRouteChange()
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  function addLog(actor, action, type) {
    const now = new Date()
    setAuditLogs((logs) => [
      {
        id: now.getTime(),
        actor,
        action,
        type,
        time: now.toLocaleString('en', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
      },
      ...logs,
    ])
  }

  function addNotification(type, recipient, message, status = 'sent') {
    setNotifications((items) => [
      {
        id: `mail-${Date.now()}`,
        type,
        recipient,
        status,
        message,
      },
      ...items,
    ])
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    const roleName = authForm.role === 'admin' ? 'Super Admin' : statusLabel(authForm.role)
    setAuthLoading(true)

    try {
      if (authMode === 'reset') {
        await sendPasswordReset({ email: authForm.email })
        setAuthMessage(`Password reset email sent by Supabase to ${authForm.email}.`)
        addNotification('Password reset', authForm.email, 'Reset link generated through Supabase Auth.')
        addLog('System', `Password reset requested for ${authForm.email}`, 'login')
        return
      }

      if (authMode === 'login') {
        const result = await loginWithSupabase({
          email: authForm.email,
          password: authForm.password,
        })
        setSessionEmail(result.user?.email || authForm.email)
        setSupabaseSession(result)
        setAuthMessage(`${roleName} logged in through Supabase Auth.`)
        addLog(authForm.email, `Logged in as ${roleName}`, 'login')
        return
      }

      await signUpWithSupabase({
        email: authForm.email,
        password: authForm.password,
        name: authForm.name,
        phone: authForm.phone,
        role: authForm.role,
      })
      setSessionEmail(authForm.email)
      setSupabaseSession(null)
      setAuthMessage(`${roleName} signup sent to Supabase. Check email verification before voting.`)
      addNotification('Email verification', authForm.email, 'Verification link sent for new account.')
      addLog('System', `Signup created for ${authForm.email}`, 'login')
    } catch (error) {
      setAuthMessage(`${error.message} Demo UI remains available while Supabase settings are completed.`)
      addLog('System', `Supabase auth error: ${error.message}`, 'security')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleCreatorRequestSubmit(event) {
    event.preventDefault()
    const request = {
      id: `req-${Date.now()}`,
      ...creatorRequestForm,
      status: 'pending',
    }
    try {
      await createCreatorRequest(creatorRequestForm, supabaseSession)
      addNotification(
        'Creator request saved',
        creatorRequestForm.email,
        'Your request was saved in Supabase and is waiting for admin review.',
      )
    } catch (error) {
      addNotification(
        'Creator request demo mode',
        creatorRequestForm.email,
        `${error.message} Request is still shown in local demo dashboard.`,
        'queued',
      )
    }
    setRequests((items) => [request, ...items])
    addLog('Election Creator', `Submitted creator request for ${creatorRequestForm.organization}`, 'approval')
  }

  function handleRequest(id, status) {
    const request = requests.find((item) => item.id === id)
    setRequests((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reason:
                status === 'rejected'
                  ? rejectionReasons[id] || 'Missing organization authorization letter.'
                  : '',
            }
          : item,
      ),
    )
    if (request) {
      addLog('Super Admin', `${statusLabel(status)} creator request for ${request.organization}`, 'approval')
      addNotification(
        status === 'approved' ? 'Approval email' : 'Rejection email',
        request.email,
        status === 'approved'
          ? 'Creator account approved and election tools unlocked.'
          : rejectionReasons[id] || 'Request rejected. Please submit missing organization proof.',
      )
    }
  }

  function handleJoin(electionId) {
    if (!termsAccepted) {
      setJoinMessage('Please accept eligibility and consent terms before joining.')
      addLog('Voter', 'Join attempt blocked because terms were not accepted', 'security')
      return
    }

    if (securityCode.trim() !== '2468') {
      setJoinMessage('CAPTCHA failed. Enter security code 2468 before joining.')
      addLog('System', 'CAPTCHA blocked voter registration attempt', 'security')
      return
    }

    const election = elections.find((item) => item.id === electionId)
    if (!election) {
      return
    }

    if (election.currentUserJoined) {
      setJoinMessage('You are already registered for this election.')
      return
    }

    if (election.locked || election.joined >= election.maxVoters) {
      setWaitlistEntries((count) => count + 1)
      setJoinMessage('Election is full. You were added to the waitlist.')
      addLog('Voter', `Added to waitlist for ${election.title}`, 'registration')
      return
    }

    setElections((items) =>
      items.map((item) => {
        if (item.id !== electionId) {
          return item
        }

        const nextJoined = item.joined + 1
        return {
          ...item,
          joined: nextJoined,
          locked: nextJoined >= item.maxVoters,
          currentUserJoined: true,
        }
      }),
    )
    setJoinMessage(`Registration confirmed for ${election.title}.`)
    addNotification('Registration confirmation', 'ali@example.com', `You joined ${election.title}.`)
    addLog('Voter', `Joined voter pool for ${election.title}`, 'registration')
  }

  function handleVote(event) {
    event.preventDefault()
    if (hasVoted) {
      setVoteMessage('Your vote has already been recorded for this poll.')
      return
    }
    if (selectedElection.status !== 'active') {
      setVoteMessage('Voting is only available while the election is active.')
      return
    }
    if (secretInput.trim().toUpperCase() !== selectedElection.secretId) {
      setVoteMessage('Secret ID could not be verified for this poll.')
      addLog('System', `Rejected invalid secret ID for ${selectedElection.title}`, 'security')
      return
    }

    setElections((items) =>
      items.map((item) =>
        item.id === selectedElection.id
          ? {
              ...item,
              candidates: item.candidates.map((candidate) =>
                candidate.id === selectedCandidate
                  ? { ...candidate, votes: candidate.votes + 1 }
                  : candidate,
              ),
            }
          : item,
      ),
    )
    setHasVoted(true)
    setVoteMessage('Vote accepted. Your ballot is counted anonymously and cannot be edited.')
    addLog('Voter', `Anonymous vote accepted for ${selectedElection.title}`, 'vote')
  }

  function handleCreateElection(event) {
    event.preventDefault()
    const id = creatorForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const newElection = {
      id: id || `election-${Date.now()}`,
      title: creatorForm.title || 'New Election Draft',
      category: creatorForm.category,
      status: 'upcoming',
      description: creatorForm.description || 'Draft election ready for candidate setup.',
      organization: 'Creator Organization',
      startsAt: creatorForm.startsAt,
      endsAt: creatorForm.endsAt,
      registrationDeadline: creatorForm.registrationDeadline,
      maxVoters: Number(creatorForm.maxVoters),
      joined: 0,
      eligible: Number(creatorForm.maxVoters),
      locked: false,
      secretId: 'POLL-D-0097',
      currentUserJoined: false,
      candidates: [
        {
          id: 'candidate-draft',
          name: 'Candidate Draft',
          designation: 'Awaiting details',
          manifesto: 'Add candidate manifesto and upload a verified photo in Supabase Storage.',
          votes: 0,
          color: '#0891b2',
        },
      ],
    }

    setElections((items) => [newElection, ...items])
    setSelectedElectionId(newElection.id)
    addLog('Election Creator', `Created draft election ${newElection.title}`, 'edit')
    setCreatorForm((form) => ({ ...form, title: '', description: '' }))
  }

  function handleAddCandidate(event) {
    event.preventDefault()
    if (!candidateForm.name.trim()) {
      return
    }

    const colors = ['#2563eb', '#0f766e', '#b45309', '#7c3aed', '#db2777', '#0891b2']
    const nextCandidate = {
      id: candidateForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: candidateForm.name,
      designation: candidateForm.designation || 'Member',
      manifesto: candidateForm.manifesto || 'Manifesto pending review.',
      votes: 0,
      color: colors[selectedElection.candidates.length % colors.length],
    }

    setElections((items) =>
      items.map((item) =>
        item.id === selectedElection.id
          ? { ...item, candidates: [...item.candidates, nextCandidate] }
          : item,
      ),
    )
    setCandidateForm({ name: '', designation: '', manifesto: '' })
    addLog('Election Creator', `Added candidate ${nextCandidate.name}`, 'edit')
  }

  function handleDeleteCandidate(candidateId) {
    setElections((items) =>
      items.map((item) =>
        item.id === selectedElection.id
          ? {
              ...item,
              candidates:
                item.candidates.length > 1
                  ? item.candidates.filter((candidate) => candidate.id !== candidateId)
                  : item.candidates,
            }
          : item,
      ),
    )
    addLog('Election Creator', `Deleted candidate from ${selectedElection.title}`, 'edit')
  }

  function handlePublishElection() {
    setElections((items) =>
      items.map((item) =>
        item.id === selectedElection.id && item.status === 'draft'
          ? { ...item, status: 'upcoming' }
          : item,
      ),
    )
    addLog('Election Creator', `Published ${selectedElection.title}`, 'edit')
  }

  function handleFinalizeVoters() {
    setElections((items) =>
      items.map((item) => (item.id === selectedElection.id ? { ...item, locked: true } : item)),
    )
    addNotification(
      'Secret ID email',
      `${selectedElection.joined} finalized voters`,
      `Unique secret IDs generated for ${selectedElection.title}.`,
      'queued',
    )
    addLog('System', `Generated finalized voter list and secret IDs for ${selectedElection.title}`, 'lock')
  }

  function handleElectionStatus(status) {
    setElections((items) =>
      items.map((item) => (item.id === selectedElection.id ? { ...item, status } : item)),
    )
    addNotification(
      status === 'active' ? 'Election start reminder' : 'Election end notification',
      `${selectedElection.joined} voters`,
      `${selectedElection.title} is now ${status}.`,
      status === 'active' ? 'sent' : 'scheduled',
    )
    addLog('Election Creator', `Set ${selectedElection.title} status to ${status}`, 'edit')
  }

  function downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function downloadAuditLogs() {
    const rows = [
      ['actor', 'type', 'action', 'time'],
      ...auditLogs.map((log) => [log.actor, log.type, log.action, log.time]),
    ]
    downloadFile('securevote-audit-logs.csv', rows.map((row) => row.join(',')).join('\n'), 'text/csv')
    addLog('Super Admin', 'Downloaded audit logs CSV', 'audit')
  }

  function downloadResults() {
    const rows = [
      ['election', 'candidate', 'votes'],
      ...selectedElection.candidates.map((candidate) => [
        selectedElection.title,
        candidate.name,
        candidate.votes,
      ]),
      ['turnout', `${turnout}%`, selectedVotes],
      ['winner', leadingCandidate.name, leadingCandidate.votes],
    ]
    downloadFile('securevote-results.csv', rows.map((row) => row.join(',')).join('\n'), 'text/csv')
    addNotification('Winner notification', selectedElection.organization, `${leadingCandidate.name} is leading.`)
    addLog('Election Creator', `Downloaded results for ${selectedElection.title}`, 'result')
  }

  function printResultPdf() {
    window.print()
    addLog('Election Creator', `Opened PDF print view for ${selectedElection.title}`, 'result')
  }

  function copyInviteLink() {
    navigator.clipboard?.writeText(inviteUrl)
    addNotification('QR invite link', selectedElection.organization, `Invite copied for ${selectedElection.title}.`)
    addLog('Election Creator', `Copied QR invite link for ${selectedElection.title}`, 'edit')
  }

  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#/" aria-label="SecureVote home">
          <span className="brand-mark">SV</span>
          <span>
            <strong>SecureVote</strong>
            <small>Online election management</small>
          </span>
        </a>
        <div className="nav-links">
          <a className={page === 'auth' ? 'active' : ''} href="#/auth">Login</a>
          <a className={page === 'elections' ? 'active' : ''} href="#/elections">Elections</a>
          <a className={page === 'results' ? 'active' : ''} href="#/results">Results</a>
          <a className={page === 'admin' ? 'active' : ''} href="#/admin">Admin</a>
          <a className={page === 'creator' ? 'active' : ''} href="#/creator">Creator</a>
          <a className={page === 'voter' ? 'active' : ''} href="#/voter">Voter</a>
          <a className={page === 'security' ? 'active' : ''} href="#/security">Security</a>
          <button type="button" className="theme-toggle" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      {page === 'home' && (
        <>
          <section className="hero-section" id="landing">
            <div className="hero-copy">
              <span className="eyebrow">Supabase-ready React semester project</span>
              <h1>Secure Online Election Management System</h1>
              <p>
                Register creators, approve elections, freeze voter lists, issue secret IDs, run
                anonymous ballots, and publish live transparent results from one responsive interface.
              </p>
              <div className="hero-actions">
                <a className="primary-action" href="#/auth">
                  Login / Signup
                </a>
                <a className="secondary-action" href="#/elections">
                  View public elections
                </a>
              </div>
            </div>
            <div className="hero-panel" aria-label="Live election summary">
              <div className="panel-head">
                <span>Live now</span>
                <strong>{selectedElection.title}</strong>
              </div>
              <div className="timer-card">
                <small>Voting closes</small>
                <strong>{formatDate(selectedElection.endsAt)}</strong>
                <span>{selectedElection.locked ? 'Final voter list locked' : 'Registration open'}</span>
              </div>
              <div className="hero-stats">
                <span>
                  <strong>{selectedVotes}</strong>
                  Votes
                </span>
                <span>
                  <strong>{turnout}%</strong>
                  Turnout
                </span>
                <span>
                  <strong>{selectedElection.joined}</strong>
                  Voters
                </span>
              </div>
            </div>
          </section>

          <section className="module-strip" aria-label="Implemented modules">
            {modules.map((module) => (
              <span key={module}>{module}</span>
            ))}
          </section>
        </>
      )}

      {page === 'auth' && (
        <section className="section auth-section" id="auth">
          <div className="section-heading">
            <span className="eyebrow">Authentication module</span>
            <h2>Signup, login, email verification, and recovery</h2>
            <p>
              This demo models the Supabase Auth flow for voters, election creators, and super
              admins, including protected sessions and password reset notifications.
            </p>
          </div>
        <div className="auth-layout">
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <div className="segmented-control" role="group" aria-label="Authentication mode">
              {[
                ['signup', 'Signup'],
                ['login', 'Login'],
                ['reset', 'Reset Password'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={authMode === value ? 'active' : ''}
                  onClick={() => setAuthMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {authMode === 'signup' && (
              <label>
                Full name
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
            </label>
            {authMode !== 'reset' && (
              <>
                <label>
                  Phone
                  <input
                    value={authForm.phone}
                    onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                  />
                </label>
                <label>
                  Role
                  <select
                    value={authForm.role}
                    onChange={(event) => setAuthForm({ ...authForm, role: event.target.value })}
                  >
                    <option value="voter">Voter</option>
                    <option value="creator">Election Creator</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                  />
                  Enable optional 2FA for sensitive actions.
                </label>
              </>
            )}
            <button className="primary-action" type="submit" disabled={authLoading}>
              {authLoading
                ? 'Connecting...'
                : authMode === 'reset'
                  ? 'Send reset email'
                  : authMode === 'login'
                    ? 'Login'
                    : 'Create account'}
            </button>
            <p className="form-message">{authMessage}</p>
            {sessionEmail && <p className="form-message">Current Supabase user: {sessionEmail}</p>}
          </form>
          <form className="auth-form creator-request-form" onSubmit={handleCreatorRequestSubmit}>
            <span className="eyebrow">Creator approval request</span>
            <h3>Request platform admin approval</h3>
            <label>
              Name
              <input
                value={creatorRequestForm.name}
                onChange={(event) =>
                  setCreatorRequestForm({ ...creatorRequestForm, name: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={creatorRequestForm.email}
                onChange={(event) =>
                  setCreatorRequestForm({ ...creatorRequestForm, email: event.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={creatorRequestForm.phone}
                onChange={(event) =>
                  setCreatorRequestForm({ ...creatorRequestForm, phone: event.target.value })
                }
              />
            </label>
            <label>
              Organization
              <input
                value={creatorRequestForm.organization}
                onChange={(event) =>
                  setCreatorRequestForm({ ...creatorRequestForm, organization: event.target.value })
                }
              />
            </label>
            <label>
              Election purpose
              <textarea
                value={creatorRequestForm.purpose}
                onChange={(event) =>
                  setCreatorRequestForm({ ...creatorRequestForm, purpose: event.target.value })
                }
              />
            </label>
            <button type="submit">Submit approval request</button>
          </form>
          <div className="auth-card-grid">
            {authCards.map((card) => (
              <article className="mini-card" key={card.title}>
                <strong>{card.title}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
        </section>
      )}

      {(page === 'elections' || page === 'voter') && (
        <section className="section" id="elections">
        <div className="section-heading">
          <span className="eyebrow">Public landing page</span>
          <h2>Election Directory</h2>
          <p>Active, upcoming, and completed polls are searchable with live turnout indicators.</p>
        </div>

        <div className="toolbar" aria-label="Election filters">
          <label className="search-field">
            <span>Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, category, organization"
            />
          </label>
          <div className="segmented-control" role="group" aria-label="Filter elections by status">
            {['all', 'upcoming', 'active', 'completed'].map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'active' : ''}
                onClick={() => setFilter(item)}
              >
                {statusLabel(item)}
              </button>
            ))}
          </div>
        </div>

        <div className="election-grid">
          {filteredElections.map((election) => {
            const votes = totalVotes(election)
            const progress = Math.round((election.joined / election.maxVoters) * 100)
            return (
              <article
                className={`election-card ${selectedElection.id === election.id ? 'selected' : ''}`}
                key={election.id}
              >
                <div className="card-head">
                  <span className={`status-pill ${election.status}`}>{statusLabel(election.status)}</span>
                  <span>{election.category}</span>
                </div>
                <h3>{election.title}</h3>
                <p>{election.description}</p>
                <dl className="meta-grid">
                  <div>
                    <dt>Registration</dt>
                    <dd>{formatDate(election.registrationDeadline)}</dd>
                  </div>
                  <div>
                    <dt>Voting</dt>
                    <dd>{formatDate(election.startsAt)}</dd>
                  </div>
                  <div>
                    <dt>Voters</dt>
                    <dd>
                      {election.joined}/{election.maxVoters}
                    </dd>
                  </div>
                  <div>
                    <dt>Votes</dt>
                    <dd>{votes}</dd>
                  </div>
                </dl>
                <div className="meter" aria-label={`${progress}% voter capacity`}>
                  <span style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="card-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedElectionId(election.id)
                      setSelectedCandidate(election.candidates[0]?.id || '')
                      setHasVoted(false)
                      setVoteMessage('Enter your poll secret ID to unlock the ballot.')
                    }}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    disabled={election.locked || election.currentUserJoined}
                    onClick={() => handleJoin(election.id)}
                  >
                    {election.currentUserJoined
                      ? 'Joined'
                      : election.locked
                        ? 'Locked'
                        : 'I Want to Participate'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        </section>
      )}

      {page === 'voter' && (
        <section className="split-section">
        <div className="section-block">
          <span className="eyebrow">Voter registration</span>
          <h2>Consent, eligibility, and voter locking</h2>
          <p>
            Voters opt in during the registration window. Once the maximum voter count is reached,
            the list is frozen and every override is logged for the admin.
          </p>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            I accept eligibility, consent, and one-vote rules.
          </label>
          <label>
            CAPTCHA / rate-limit check
            <input
              value={securityCode}
              onChange={(event) => setSecurityCode(event.target.value)}
              placeholder="Enter 2468"
            />
            <small>Demo code: 2468</small>
          </label>
          <p className="form-message">{joinMessage}</p>
          <div className="lock-panel">
            <strong>{selectedElection.locked ? 'Final voter list frozen' : 'Registration window open'}</strong>
            <span>
              {selectedElection.joined} of {selectedElection.maxVoters} approved voters registered
            </span>
            <span>{waitlistEntries} voters are currently waiting for admin override slots.</span>
          </div>
        </div>

        <div className="section-block">
          <span className="eyebrow">Secret ID voting</span>
          <h2>Anonymous Ballot</h2>
          <form className="vote-form" onSubmit={handleVote}>
            <label>
              Secret voter ID
              <input
                type="text"
                value={secretInput}
                onChange={(event) => setSecretInput(event.target.value)}
                placeholder="POLL-A-7821"
              />
              <small>Masked on dashboards as ****{selectedElection.secretId.slice(-4)}</small>
            </label>
            <label>
              Candidate
              <select
                value={selectedCandidate}
                onChange={(event) => setSelectedCandidate(event.target.value)}
              >
                {selectedElection.candidates.map((candidate) => (
                  <option value={candidate.id} key={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="primary-action" type="submit" disabled={hasVoted}>
              Cast anonymous vote
            </button>
            <p className="form-message">{voteMessage}</p>
          </form>
        </div>
        </section>
      )}

      {page === 'results' && (
        <section className="section results-section">
        <div className="section-heading">
          <span className="eyebrow">Live results</span>
          <h2>{selectedElection.title}</h2>
          <p>
            Candidate-wise results update instantly, with turnout and winner details available to
            creators and admins.
          </p>
        </div>
        <div className="results-layout">
          <div className="candidate-list">
            {selectedElection.candidates.map((candidate) => {
              const percentage = selectedVotes ? Math.round((candidate.votes / selectedVotes) * 100) : 0
              return (
                <article className="candidate-card" key={candidate.id}>
                  <div className="avatar" style={{ background: candidate.color }}>
                    {candidate.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <h3>{candidate.name}</h3>
                    <span>{candidate.designation}</span>
                    <p>{candidate.manifesto}</p>
                    <div className="result-bar">
                      <span style={{ width: `${percentage}%`, background: candidate.color }} />
                    </div>
                  </div>
                  <strong>{percentage}%</strong>
                </article>
              )
            })}
          </div>
          <aside className="winner-panel">
            <span className="eyebrow">Current winner</span>
            <h3>{leadingCandidate.name}</h3>
            <p>{leadingCandidate.votes} verified anonymous votes</p>
            <dl>
              <div>
                <dt>Turnout</dt>
                <dd>{turnout}%</dd>
              </div>
              <div>
                <dt>Result lock</dt>
                <dd>{selectedElection.status === 'completed' ? 'Locked' : 'Pending close'}</dd>
              </div>
            </dl>
            <div className="control-grid">
              <button type="button" onClick={downloadResults}>
                Download CSV
              </button>
              <button type="button" onClick={printResultPdf}>
                Result PDF
              </button>
            </div>
          </aside>
        </div>
        </section>
      )}

      {['admin', 'creator', 'voter'].includes(page) && (
        <section className="section dashboard-section" id="dashboard">
        <div className="section-heading">
          <span className="eyebrow">Role-based access</span>
          <h2>Dashboards</h2>
          <p>{roleSummaries[role]}</p>
        </div>
        <div className="role-tabs" role="tablist" aria-label="Dashboard roles">
          {['admin', 'creator', 'voter'].map((item) => (
            <button
              key={item}
              type="button"
              className={role === item ? 'active' : ''}
              onClick={() => setRole(item)}
            >
              {item === 'admin' ? 'Super Admin' : statusLabel(item)}
            </button>
          ))}
        </div>

        {role === 'admin' && (
          <div className="dashboard-grid">
            <div className="stat-row">
              <span>
                <strong>{elections.length}</strong>
                Total elections
              </span>
              <span>
                <strong>{elections.filter((item) => item.status === 'active').length}</strong>
                Active
              </span>
              <span>
                <strong>{requests.filter((item) => item.status === 'pending').length}</strong>
                Pending requests
              </span>
            </div>
            <div className="request-list">
              {requests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div>
                    <strong>{request.name}</strong>
                    <span>{request.organization}</span>
                    <p>{request.purpose}</p>
                    <small>
                      {request.email} | {request.phone}
                    </small>
                  </div>
                  <div className="request-actions">
                    <span className={`status-pill ${request.status}`}>{statusLabel(request.status)}</span>
                    <input
                      aria-label={`Rejection reason for ${request.name}`}
                      value={rejectionReasons[request.id] || ''}
                      onChange={(event) =>
                        setRejectionReasons({
                          ...rejectionReasons,
                          [request.id]: event.target.value,
                        })
                      }
                      placeholder="Rejection reason"
                      disabled={request.status !== 'pending'}
                    />
                    <button
                      type="button"
                      disabled={request.status !== 'pending'}
                      onClick={() => handleRequest(request.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={request.status !== 'pending'}
                      onClick={() => handleRequest(request.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="admin-panels">
              <article className="mini-card">
                <strong>Approved Elections</strong>
                <p>
                  {elections.filter((item) => item.status !== 'draft').length} published elections are visible on
                  the landing page.
                </p>
              </article>
              <article className="mini-card">
                <strong>Admin Overrides</strong>
                <p>
                  Override voter finalization only after adding a reason. Every change is written to the
                  audit log.
                </p>
              </article>
              <article className="mini-card">
                <strong>Download Logs</strong>
                <p>Audit rows are ready for CSV/PDF export in the transparency dashboard.</p>
                <button type="button" onClick={downloadAuditLogs}>
                  Download audit CSV
                </button>
              </article>
            </div>
          </div>
        )}

        {role === 'creator' && (
          <div className="dashboard-grid creator-grid">
            <form className="creator-form" onSubmit={handleCreateElection}>
              <label>
                Election title
                <input
                  value={creatorForm.title}
                  onChange={(event) => setCreatorForm({ ...creatorForm, title: event.target.value })}
                  placeholder="Faculty Council Election"
                />
              </label>
              <label>
                Category
                <select
                  value={creatorForm.category}
                  onChange={(event) => setCreatorForm({ ...creatorForm, category: event.target.value })}
                >
                  <option>Campus</option>
                  <option>Civic</option>
                  <option>Organization</option>
                  <option>Corporate</option>
                </select>
              </label>
              <label>
                Max voters
                <input
                  type="number"
                  min="10"
                  value={creatorForm.maxVoters}
                  onChange={(event) => setCreatorForm({ ...creatorForm, maxVoters: event.target.value })}
                />
              </label>
              <label>
                Registration deadline
                <input
                  type="datetime-local"
                  value={creatorForm.registrationDeadline}
                  onChange={(event) =>
                    setCreatorForm({ ...creatorForm, registrationDeadline: event.target.value })
                  }
                />
              </label>
              <label>
                Start date/time
                <input
                  type="datetime-local"
                  value={creatorForm.startsAt}
                  onChange={(event) => setCreatorForm({ ...creatorForm, startsAt: event.target.value })}
                />
              </label>
              <label>
                End date/time
                <input
                  type="datetime-local"
                  value={creatorForm.endsAt}
                  onChange={(event) => setCreatorForm({ ...creatorForm, endsAt: event.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  value={creatorForm.description}
                  onChange={(event) =>
                    setCreatorForm({ ...creatorForm, description: event.target.value })
                  }
                  placeholder="Describe purpose, organization, and eligibility"
                />
              </label>
              <button className="primary-action" type="submit">
                Create draft election
              </button>
            </form>
            <div className="creator-panel">
              <h3>Election Controls</h3>
              <p>
                Manage the selected election lifecycle, freeze voters, generate secret IDs, and notify
                participants.
              </p>
              <div className="control-grid">
                <button type="button" onClick={handlePublishElection}>
                  Publish
                </button>
                <button type="button" onClick={handleFinalizeVoters}>
                  Finalize voters
                </button>
                <button type="button" onClick={() => handleElectionStatus('active')}>
                  Start election
                </button>
                <button type="button" onClick={() => handleElectionStatus('completed')}>
                  Stop election
                </button>
              </div>
              <div className="qr-panel">
                <div className="qr-code" aria-label="QR invite preview">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div>
                  <strong>QR invite link</strong>
                  <small>{inviteUrl}</small>
                  <button type="button" onClick={copyInviteLink}>
                    Copy invite
                  </button>
                </div>
              </div>
              <h3>Candidate Management</h3>
              <p>Candidate photos are designed for Supabase Storage with names, designations, and manifestos.</p>
              <form className="candidate-form" onSubmit={handleAddCandidate}>
                <input
                  value={candidateForm.name}
                  onChange={(event) => setCandidateForm({ ...candidateForm, name: event.target.value })}
                  placeholder="Candidate name"
                />
                <input
                  value={candidateForm.designation}
                  onChange={(event) =>
                    setCandidateForm({ ...candidateForm, designation: event.target.value })
                  }
                  placeholder="Designation"
                />
                <textarea
                  value={candidateForm.manifesto}
                  onChange={(event) =>
                    setCandidateForm({ ...candidateForm, manifesto: event.target.value })
                  }
                  placeholder="Manifesto or description"
                />
                <button type="submit">Add candidate</button>
              </form>
              {selectedElection.candidates.map((candidate) => (
                <div className="compact-candidate" key={candidate.id}>
                  <span style={{ background: candidate.color }}>{candidate.name[0]}</span>
                  <div>
                    <strong>{candidate.name}</strong>
                    <small>{candidate.designation}</small>
                  </div>
                  <button type="button" onClick={() => handleDeleteCandidate(candidate.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {role === 'voter' && (
          <div className="dashboard-grid">
            <div className="stat-row">
              <span>
                <strong>{elections.filter((item) => item.currentUserJoined).length}</strong>
                Joined polls
              </span>
              <span>
                <strong>****{selectedElection.secretId.slice(-4)}</strong>
                Secret ID
              </span>
              <span>
                <strong>{hasVoted ? 'Cast' : 'Open'}</strong>
                Voting status
              </span>
            </div>
            <div className="voter-list">
              {elections
                .filter((item) => item.currentUserJoined)
                .map((election) => (
                  <article className="request-card" key={election.id}>
                    <div>
                      <strong>{election.title}</strong>
                      <span>{election.organization}</span>
                      <p>
                        Voting window: {formatDate(election.startsAt)} to {formatDate(election.endsAt)}
                      </p>
                    </div>
                    <span className={`status-pill ${election.status}`}>{statusLabel(election.status)}</span>
                  </article>
                ))}
            </div>
            <div className="admin-panels">
              <article className="mini-card">
                <strong>Waitlist</strong>
                <p>{waitlistEntries} users are waiting for a slot when elections are full.</p>
              </article>
              <article className="mini-card">
                <strong>QR Invite Links</strong>
                <p>Bonus-ready invite codes can point voters to a verified election join page.</p>
              </article>
              <article className="mini-card">
                <strong>Voting Receipt</strong>
                <p>Anonymous receipts confirm that a vote was accepted without revealing the candidate.</p>
              </article>
            </div>
          </div>
        )}
        </section>
      )}

      {(page === 'results' || page === 'admin') && (
        <section className="section notification-section">
        <div className="section-heading">
          <span className="eyebrow">Notification module</span>
          <h2>Email queue and reminders</h2>
          <p>
            Verification, approval, rejection, secret ID, start reminder, end notification, and winner
            emails are represented here and ready for a Resend or Supabase Edge Function backend.
          </p>
        </div>
        <div className="notification-grid">
          {notifications.map((notification) => (
            <article className="mini-card" key={notification.id}>
              <span className={`status-pill ${notification.status}`}>{notification.status}</span>
              <strong>{notification.type}</strong>
              <small>{notification.recipient}</small>
              <p>{notification.message}</p>
            </article>
          ))}
        </div>
        </section>
      )}

      {page === 'security' && (
        <section className="split-section security-section" id="security">
        <div className="section-block">
          <span className="eyebrow">Security module</span>
          <h2>Controls prepared for Supabase</h2>
          <ul className="check-list">
            <li>Email verification and password reset through Supabase Auth.</li>
            <li>RLS policies for creators, voters, admins, votes, and audit logs.</li>
            <li>Duplicate-vote prevention with unique voter/poll constraints.</li>
            <li>Anonymous ballot table separate from voter identity records.</li>
            <li>CAPTCHA, rate limiting, validation, and encrypted secrets in edge functions.</li>
          </ul>
          <div className="lock-panel">
            <strong>Backend status</strong>
            <span>{getBackendStatus()}</span>
          </div>
        </div>
        <div className="section-block audit-block">
          <span className="eyebrow">Audit and transparency</span>
          <h2>Activity Logs</h2>
          <div className="audit-list">
            {auditLogs.slice(0, 6).map((log) => (
              <article key={log.id}>
                <span>{log.type}</span>
                <strong>{log.action}</strong>
                <small>
                  {log.actor} | {log.time}
                </small>
              </article>
            ))}
          </div>
        </div>
        </section>
      )}
    </main>
  )
}

export default App
