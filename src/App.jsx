
import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_URL = 'https://ecoaware-backend1.onrender.com'

const topics = [
  {
    icon: '♻️',
    title: 'Waste Management',
    color: 'mint',
    description: 'Learn how to segregate waste, recycle materials and reduce plastic pollution.',
    details: [
      'Separate wet, dry and hazardous waste.',
      'Keep food scraps separate for composting.',
      'Rinse recyclable containers when necessary.',
      'Follow your local recycling guidelines.',
      'Reuse shopping bags, bottles and containers.',
      'Choose products with less packaging.',
      'Avoid single-use plastics when possible.',
      'Never throw batteries into regular rubbish.',
      'Take electronic waste to authorised collection centres.',
      'Donate usable clothes, books and household items.',
      'Repair broken items instead of replacing them.',
      'Compost fruit peels and vegetable scraps.',
      'Keep recyclable materials clean and dry.',
      'Never litter streets, lakes or public spaces.',
      'Participate in neighbourhood clean-up drives.',
      'Buy only what you need to prevent unnecessary waste.',
      'Teach family members how to segregate waste.',
      'Reduce and reuse before choosing to recycle.',
    ],
  },
  {
    icon: '💧',
    title: 'Water Conservation',
    color: 'blue',
    description: 'Discover simple ways to save water and protect our precious water resources.',
    details: [
      'Turn off the tap while brushing your teeth.',
      'Repair leaking taps and pipes promptly.',
      'Take shorter showers whenever possible.',
      'Run washing machines with suitable full loads.',
      'Use a bucket instead of a running hose.',
      'Water plants in the early morning or evening.',
      'Grow plants suited to your local climate.',
      'Collect rainwater where permitted.',
      'Reuse suitable leftover water for plants.',
      'Install water-efficient taps when possible.',
      'Never pour chemicals or oil into drains.',
      'Keep rivers and lakes free from rubbish.',
      'Use a broom instead of a hose for outdoor cleaning.',
      'Check for unexpected increases in water use.',
      'Use a basin when washing dishes where practical.',
      'Protect trees and green spaces around water sources.',
      'Report leaking public water pipes.',
      'Encourage friends and family to save water.',
    ],
  },
  {
    icon: '🌿',
    title: 'Air Pollution',
    color: 'green',
    description: 'Understand air pollution and explore ways to make the air cleaner.',
    details: [
      'Vehicle exhaust is a source of air pollution.',
      'Burning rubbish releases harmful pollutants.',
      'Never burn plastic or household waste.',
      'Walk for short journeys when routes are safe.',
      'Cycle when it is safe and practical.',
      'Use public transport whenever possible.',
      'Share rides to reduce unnecessary vehicle journeys.',
      'Maintain vehicles according to recommendations.',
      'Switch off idling engines when appropriate and safe.',
      'Use cleaner cooking methods where available.',
      'Save electricity to help reduce power-related emissions.',
      'Protect trees and green spaces.',
      'Avoid smoking indoors and around other people.',
      'Check local air-quality reports during pollution events.',
      'Follow health advice when air quality is poor.',
      'Support clean energy and pollution-control measures.',
      'Report illegal waste burning through safe local channels.',
      'Remember that cleaner air requires community-wide action.',
    ],
  },
  {
    icon: '🌍',
    title: 'Climate Change',
    color: 'yellow',
    description: 'Explore climate change, its causes and actions that can protect our planet.',
    details: [
      'Climate change involves long-term changes in climate patterns.',
      'Human activities are the main cause of recent global warming.',
      'Burning coal, oil and gas releases greenhouse gases.',
      'Carbon dioxide is an important greenhouse gas.',
      'Methane also contributes to global warming.',
      'Deforestation reduces carbon storage in ecosystems.',
      'Global warming can increase heatwave risks.',
      'Rising temperatures contribute to sea-level rise.',
      'Climate change affects ecosystems and agriculture.',
      'Climate impacts can affect water supplies and human health.',
      'Saving energy can reduce associated emissions.',
      'Walking and cycling can reduce transport emissions.',
      'Public transport can reduce emissions per passenger.',
      'Reducing food waste helps avoid unnecessary emissions.',
      'Protecting forests supports biodiversity and climate resilience.',
      'Solar and wind energy can replace some fossil-fuel use.',
      'Mitigation means reducing the causes of climate change.',
      'Adaptation means preparing for climate-related impacts.',
    ],
  },
  {
    icon: '⚡',
    title: 'Energy Conservation',
    color: 'orange',
    description: 'Discover renewable energy and ways to use electricity responsibly.',
    details: [
      'Switch off lights when rooms are not being used.',
      'Use natural daylight whenever practical.',
      'Choose energy-efficient appliances when replacing old ones.',
      'Check energy-efficiency labels before purchasing appliances.',
      'Turn off electronics when they are not needed.',
      'Unplug chargers when appropriate.',
      'Use LED bulbs where suitable.',
      'Set air conditioners to a comfortable temperature.',
      'Keep doors and windows closed while cooling a room.',
      'Clean appliance filters according to instructions.',
      'Use washing machines efficiently.',
      'Air-dry clothes when weather permits.',
      'Avoid leaving refrigerator doors open unnecessarily.',
      'Explore solar energy options where feasible.',
      'Use fans and natural ventilation when effective.',
      'Reduce unnecessary hot-water use.',
      'Ask a qualified professional to handle electrical repairs.',
      'Saving energy can reduce bills and pollution.',
    ],
  },
]

function RoamingBuddy({ emoji, name, className = '', delay = 0 }) {
  const buddyRef = useRef(null)

  useEffect(() => {
    const buddy = buddyRef.current
    if (!buddy || !buddy.parentElement) return

    const area = buddy.parentElement
    let timer
    let cancelled = false

    function moveBuddy() {
      if (cancelled || !buddy.isConnected) return

      const maxX = Math.max(12, area.clientWidth - buddy.offsetWidth - 12)
      const maxY = Math.max(12, area.clientHeight - buddy.offsetHeight - 12)

      buddy.style.left = `${12 + Math.random() * Math.max(0, maxX - 12)}px`
      buddy.style.top = `${12 + Math.random() * Math.max(0, maxY - 12)}px`
      buddy.style.setProperty('--buddy-tilt', `${Math.random() * 24 - 12}deg`)

      timer = setTimeout(moveBuddy, 2500)
    }

    const startTimer = setTimeout(moveBuddy, delay)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
      clearTimeout(timer)
    }
  }, [delay])

  return (
    <span
      ref={buddyRef}
      className={`roaming-buddy ${className}`}
      role="img"
      aria-label={name}
      title={name}
    >
      {emoji}
    </span>
  )
}

function RunningSprout() {
  const [stage, setStage] = useState('sleep')

  useEffect(() => {
    let wakeTimer
    let runTimer
    let resetTimer
    let cancelled = false

    function cycle() {
      if (cancelled) return

      setStage('sleep')

      wakeTimer = setTimeout(() => {
        if (cancelled) return
        setStage('wake')

        runTimer = setTimeout(() => {
          if (cancelled) return
          setStage('run')
          resetTimer = setTimeout(cycle, 6000)
        }, 900)
      }, 3500)
    }

    cycle()

    return () => {
      cancelled = true
      clearTimeout(wakeTimer)
      clearTimeout(runTimer)
      clearTimeout(resetTimer)
    }
  }, [])

  return (
    <span className={`running-sprout sprout-${stage}`} aria-hidden="true">
      <span className="sprout-face">🌱</span>
      {stage === 'sleep' && <span className="sleep-z">z z</span>}
      {stage === 'wake' && <span className="wake-sparkle">✨</span>}
    </span>
  )
}

function TopicDetailsModal({ topic, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!topic) return null

  return (
    <div
      className="quiz-overlay topic-details-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="quiz-modal topic-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-details-title"
      >
        <button
          className="quiz-close"
          onClick={onClose}
          aria-label="Close topic details"
        >
          ✕
        </button>

        <span className={`topic-icon ${topic.color}`}>
          {topic.icon}
        </span>

        <p className="quiz-progress">ECOAWARE LEARNING GUIDE</p>

        <h2 id="topic-details-title">{topic.title}</h2>

        <p className="topic-details-intro">{topic.description}</p>

        <div className="topic-details-list">
          <h3>{topic.details.length} useful things to know and try</h3>

          <ul>
            {topic.details.map((point, index) => (
              <li key={`${topic.title}-${index}`}>{point}</li>
            ))}
          </ul>
        </div>

        <button className="primary-button" onClick={onClose}>
          Got it ✓
        </button>
      </section>
    </div>
  )
}

function EcoQuiz({ onClose }) {
  const [questions, setQuestions] = useState([])
  const [attemptId, setAttemptId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function loadQuiz() {
    setLoading(true)
    setError('')
    setQuestions([])
    setAttemptId('')
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResults(null)

    try {
      const response = await fetch(`${API_URL}/quiz/questions`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load quiz questions.')
      }

      if (
        !data.attempt_id ||
        !Array.isArray(data.questions) ||
        data.questions.length !== 8
      ) {
        throw new Error(
          `Expected 8 quiz questions, but the server returned ${
            Array.isArray(data.questions) ? data.questions.length : 0
          }. Check the backend /quiz/questions endpoint.`,
        )
      }

      setAttemptId(data.attempt_id)
      setQuestions(data.questions)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Make sure FastAPI is running on port 8000.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuiz()
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !submitting) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, submitting])

  const question = questions[currentQuestion]
  const selectedAnswer = question
    ? selectedAnswers[question.id]
    : undefined

  function chooseAnswer(index) {
    if (submitting || results || !question) return

    setSelectedAnswers((previous) => ({
      ...previous,
      [question.id]: index,
    }))
  }

  async function nextQuestion() {
    if (selectedAnswer === undefined || submitting) return

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1)
    } else {
      await submitQuiz()
    }
  }

  async function submitQuiz() {
    setSubmitting(true)
    setError('')

    try {
      const answers = questions.map((item) => ({
        question_id: item.id,
        selected_option: selectedAnswers[item.id],
      }))

      const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptId,
          answers,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not submit your quiz.')
      }

      setResults(data)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not connect to the backend. Check that your server is running.'
          : err.message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="quiz-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose()
      }}
    >
      <div
        className="quiz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eco-quiz-title"
      >
        <button
          className="quiz-close"
          onClick={onClose}
          aria-label="Close quiz"
          disabled={submitting}
        >
          ✕
        </button>

        {loading ? (
          <div className="quiz-results">
            <span className="quiz-modal-icon">🌱</span>
            <h2 id="eco-quiz-title">Preparing your eco quiz...</h2>
            <p>Loading your 8 environmental questions.</p>
          </div>
        ) : error && questions.length === 0 ? (
          <div className="quiz-results">
            <span className="quiz-modal-icon">🌿</span>
            <h2 id="eco-quiz-title">Oops! Something went wrong.</h2>
            <p className="quiz-result-message">{error}</p>

            <button className="primary-button" onClick={loadQuiz}>
              Try Again ↻
            </button>

            <button className="quiz-secondary-action" onClick={onClose}>
              Back to EcoAware
            </button>
          </div>
        ) : results ? (
          <div className="quiz-results">
            <span className="quiz-modal-icon">
              {results.percentage >= 80
                ? '🏆'
                : results.percentage >= 50
                  ? '🌟'
                  : '🌱'}
            </span>

            <p className="quiz-progress">QUIZ COMPLETED</p>

            <h2 id="eco-quiz-title">
              {results.percentage >= 80
                ? 'Amazing, Eco Champion!'
                : results.percentage >= 50
                  ? 'Great work, Planet Protector!'
                  : 'Every step helps our planet!'}
            </h2>

            <p className="quiz-score">
              {results.score} <span>/ {results.total}</span>
            </p>

            <p className="quiz-result-message">
              You scored {results.percentage}%. Keep learning and turn your
              knowledge into greener everyday habits.
            </p>

            <div className="quiz-review">
              <h3>Your answers</h3>

              {results.results?.map((item, index) => (
                <div className="quiz-explanation" key={item.question_id}>
                  <strong>
                    {index + 1}. {item.is_correct ? '✅ Correct' : '🌿 Review'}
                  </strong>

                  <p>{item.question}</p>

                  <p>
                    <strong>Your answer: </strong>
                    {item.options?.[item.selected_option] ?? 'Not available'}
                  </p>

                  {!item.is_correct && (
                    <p>
                      <strong>Correct answer: </strong>
                      {item.options?.[item.correct_option] ?? 'Not available'}
                    </p>
                  )}

                  <p>{item.explanation}</p>
                </div>
              ))}
            </div>

            <button className="primary-button" onClick={loadQuiz}>
              Play Again ↻
            </button>

            <button className="quiz-secondary-action" onClick={onClose}>
              Back to EcoAware
            </button>
          </div>
        ) : question ? (
          <>
            <span className="quiz-modal-icon">🌱</span>

            <p className="quiz-progress">
              QUESTION {currentQuestion + 1} OF {questions.length}
            </p>

            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <p className="quiz-topic">{question.topic}</p>
            <h2 id="eco-quiz-title">{question.question}</h2>

            <div className="quiz-options">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index

                return (
                  <button
                    key={`${question.id}-${index}`}
                    className={`quiz-option${isSelected ? ' selected' : ''}`}
                    onClick={() => chooseAnswer(index)}
                    disabled={submitting}
                    aria-pressed={isSelected}
                  >
                    <span className="quiz-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span>{option}</span>

                    {isSelected && (
                      <span className="quiz-option-mark">✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="quiz-explanation">
                <strong>Submission failed</strong>
                <p>{error}</p>
                <p>Your selected answers have been kept. You can try again.</p>
              </div>
            )}

            <button
              className="primary-button quiz-next"
              onClick={nextQuestion}
              disabled={selectedAnswer === undefined || submitting}
            >
              {submitting
                ? 'Submitting...'
                : currentQuestion === questions.length - 1
                  ? 'Submit Quiz →'
                  : 'Next Question →'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

function App() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)

  const startQuiz = (event) => {
    if (event) event.preventDefault()
    setQuizOpen(true)
  }

  const closeQuiz = () => setQuizOpen(false)
  const openTopicDetails = (topic) => setSelectedTopic(topic)
  const closeTopicDetails = () => setSelectedTopic(null)

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">🌱</span> Eco<span>Aware</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#topics">Explore</a>
          <a href="#campaigns">Campaigns</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <button className="nav-button" onClick={startQuiz}>
          Take a Quiz ↗
        </button>
      </header>

      <main>
        <section className="hero-section roam-container" id="home">
          <div className="hero-content">
            <div className="eyebrow">🌎 SMALL STEPS. BIG IMPACT.</div>

            <h1>
              A greener future
              <br />
              <span>starts with you.</span>
              <RunningSprout />
            </h1>

            <p className="hero-description">
              Learn about our planet, discover sustainable habits, and turn
              everyday actions into a better tomorrow.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#topics">
                Explore &amp; Learn →
              </a>

              <button className="secondary-button" onClick={startQuiz}>
                Test Your Knowledge ↗
              </button>
            </div>

            <div className="hero-note">
              <span className="online-dot" />
              Every small action counts. Start yours today.
            </div>
          </div>

          <div className="planet-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="planet">
              <span>🌍</span>
            </div>

            <span className="floating-leaf leaf-one">🌿</span>
            <span className="floating-leaf leaf-two">🍃</span>
            <span className="floating-leaf leaf-three">🌱</span>

            <div className="planet-caption">
              <span>OUR PLANET,</span>
              <strong>OUR RESPONSIBILITY.</strong>
            </div>

            <div className="local-roam-layer">
              <RoamingBuddy
                emoji="🐸"
                name="Pip"
                className="buddy-pip"
                delay={300}
              />
            </div>
          </div>

          <div className="roam-layer hero-roam-layer">
            <RoamingBuddy
              emoji="🐰"
              name="Mochi"
              className="buddy-mochi"
              delay={700}
            />
          </div>
        </section>

        <section className="impact-strip">
          <div>
            <span className="impact-icon">🌱</span>
            <p>
              <strong>Learn</strong>
              <small>Build awareness</small>
            </p>
          </div>

          <div>
            <span className="impact-icon">♻️</span>
            <p>
              <strong>Act</strong>
              <small>Make better choices</small>
            </p>
          </div>

          <div>
            <span className="impact-icon">🌏</span>
            <p>
              <strong>Inspire</strong>
              <small>Create lasting change</small>
            </p>
          </div>
        </section>

        <section className="topics-section roam-container" id="topics">
          <div className="section-heading">
            <div>
              <span className="section-label">
                DISCOVER • UNDERSTAND • PROTECT
              </span>

              <h2>Explore environmental topics</h2>

              <p>
                Knowledge is the first step towards a healthier planet.
              </p>
            </div>

            <span className="heading-decoration">✳</span>

            <div className="local-roam-layer lumi-roam-layer">
              <RoamingBuddy
                emoji="🧚"
                name="Lumi"
                className="buddy-lumi"
                delay={500}
              />
            </div>
          </div>

          <div className="topic-grid">
            {topics.map((topic, index) => (
              <article
                className={`topic-card ${topic.color} ${
                  index === 0 ? 'roam-container' : ''
                }`}
                key={topic.title}
              >
                <div className={`topic-icon ${topic.color}`}>
                  {topic.icon}
                </div>

                {index === 0 && (
                  <div className="local-roam-layer mushie-roam-layer">
                    <RoamingBuddy
                      emoji="🍄"
                      name="Mushie"
                      className="buddy-mushie"
                      delay={900}
                    />
                  </div>
                )}

                <h3>{topic.title}</h3>
                <p>{topic.description}</p>

                <button
                  type="button"
                  className="topic-learn-more"
                  onClick={() => openTopicDetails(topic)}
                >
                  Learn more →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="quiz-banner roam-container" id="quiz">
          <div className="quiz-symbol">🧠</div>

          <div className="quiz-copy">
            <span className="section-label">READY FOR A CHALLENGE?</span>
            <h2>How eco-aware are you?</h2>
            <p>Put your environmental knowledge to the test.</p>
          </div>

          <button className="primary-button" onClick={startQuiz}>
            Take the Quiz →
          </button>

          <div className="roam-layer">
            <RoamingBuddy
              emoji="🐰"
              name="Mochi"
              className="buddy-quiz"
              delay={1100}
            />
          </div>
        </section>

        <section className="campaign-preview roam-container" id="campaigns">
          <span className="section-label">BE PART OF THE CHANGE</span>
          <h2>Change starts in your community.</h2>

          <p>
            Discover environmental campaigns, participate in local activities,
            and help make your surroundings greener.
          </p>

          <div className="campaign-placeholder">
            <span>🌳</span>

            <div>
              <strong>Community campaigns</strong>
              <p>
                Tree planting • Cleanliness drives • Recycling awareness
              </p>
            </div>
          </div>

          <div className="roam-layer">
            <RoamingBuddy
              emoji="🐸"
              name="Pip"
              className="buddy-campaign"
              delay={1400}
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          🌱 Eco<span>Aware</span>
        </a>

        <p>Learn today. Protect tomorrow. 💚</p>

        <span>Building a greener future, one step at a time.</span>
      </footer>

      {selectedTopic && (
        <TopicDetailsModal
          topic={selectedTopic}
          onClose={closeTopicDetails}
        />
      )}

      {quizOpen && <EcoQuiz onClose={closeQuiz} />}
    </div>
  )
}

export default App
