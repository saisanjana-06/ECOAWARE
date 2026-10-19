
import json
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.database import get_db, initialize_database


# ---------------- APPLICATION SETUP ----------------

app = FastAPI(
    title="Environmental Awareness API",
    description="Backend for Environmental Awareness Among Citizens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
        allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://ecoaware1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Environmental Awareness Backend is running!"
    }


# ---------------- AWARENESS TOPICS ----------------

AWARENESS_TOPICS = [
    {
        "id": 1,
        "title": "Waste Management",
        "description": "Learn about waste segregation and recycling."
    },
    {
        "id": 2,
        "title": "Water Conservation",
        "description": "Learn how to save water and reduce wastage."
    },
    {
        "id": 3,
        "title": "Air Pollution",
        "description": "Understand the causes of air pollution."
    },
    {
        "id": 4,
        "title": "Climate Change",
        "description": "Learn about climate change and sustainability."
    },
    {
        "id": 5,
        "title": "Energy Conservation",
        "description": "Learn how to save electricity."
    }
]


@app.get("/awareness")
def get_awareness():
    return AWARENESS_TOPICS


# ---------------- CAMPAIGNS ----------------

@app.get("/campaigns")
def get_campaigns():
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM campaigns ORDER BY id"
        ).fetchall()

    return [dict(row) for row in rows]


# ---------------- CAMPAIGN REGISTRATION ----------------

class Registration(BaseModel):
    name: str
    email: str


@app.post("/campaigns/{campaign_id}/register")
def register_for_campaign(
    campaign_id: int,
    registration: Registration
):
    name = registration.name.strip()
    email = registration.email.strip()

    if not name or "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Enter a valid name and email address."
        )

    with get_db() as db:
        campaign = db.execute(
            "SELECT id FROM campaigns WHERE id = ?",
            (campaign_id,)
        ).fetchone()

        if campaign is None:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found."
            )

        cursor = db.execute(
            """
            INSERT INTO registrations (campaign_id, name, email)
            VALUES (?, ?, ?)
            """,
            (campaign_id, name, email)
        )

        registration_id = cursor.lastrowid

    return {
        "message": "Registration successful!",
        "registration_id": registration_id,
        "campaign_id": campaign_id
    }


# ---------------- QUIZ QUESTIONS ----------------
# Return ALL existing questions instead of five random questions.

@app.get("/quiz/questions")
def get_quiz_questions():
    with get_db() as db:
        rows = db.execute(
            """
            SELECT id, topic, question,
                   option_a, option_b, option_c, option_d
            FROM quiz_questions
            ORDER BY id
            """
        ).fetchall()

        if not rows:
            raise HTTPException(
                status_code=500,
                detail="No quiz questions found in the database."
            )

        selected_questions = list(rows)
        attempt_id = str(uuid.uuid4())

        question_ids = [
            question["id"] for question in selected_questions
        ]

        db.execute(
            """
            INSERT INTO quiz_attempts (id, question_ids)
            VALUES (?, ?)
            """,
            (attempt_id, json.dumps(question_ids))
        )

        db.commit()

    return {
        "attempt_id": attempt_id,
        "total_questions": len(selected_questions),
        "questions": [
            {
                "id": question["id"],
                "topic": question["topic"],
                "question": question["question"],
                "options": [
                    question["option_a"],
                    question["option_b"],
                    question["option_c"],
                    question["option_d"]
                ]
            }
            for question in selected_questions
        ]
    }


# ---------------- QUIZ SUBMISSION MODELS ----------------

class QuizAnswer(BaseModel):
    question_id: int
    selected_option: int = Field(ge=0, le=3)


class QuizSubmission(BaseModel):
    attempt_id: str
    answers: list[QuizAnswer]


# ---------------- SUBMIT QUIZ ----------------

@app.post("/quiz/submit")
def submit_quiz(submission: QuizSubmission):

    submitted_ids = [
        answer.question_id for answer in submission.answers
    ]

    if len(submitted_ids) != len(set(submitted_ids)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate question answers are not allowed."
        )

    with get_db() as db:
        attempt = db.execute(
            """
            SELECT question_ids, submitted
            FROM quiz_attempts
            WHERE id = ?
            """,
            (submission.attempt_id,)
        ).fetchone()

        if attempt is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid quiz attempt. Please start a new quiz."
            )

        if attempt["submitted"]:
            raise HTTPException(
                status_code=400,
                detail="This quiz attempt has already been submitted."
            )

        issued_ids = json.loads(attempt["question_ids"])

        if len(submission.answers) != len(issued_ids):
            raise HTTPException(
                status_code=400,
                detail=f"Please submit answers for all {len(issued_ids)} questions."
            )

        if set(submitted_ids) != set(issued_ids):
            raise HTTPException(
                status_code=400,
                detail="Submitted questions do not match this quiz attempt."
            )

        placeholders = ",".join("?" for _ in issued_ids)

        question_rows = db.execute(
            f"""
            SELECT id, topic, question,
                   option_a, option_b, option_c, option_d,
                   correct_answer, explanation
            FROM quiz_questions
            WHERE id IN ({placeholders})
            """,
            issued_ids
        ).fetchall()

        question_map = {
            question["id"]: question for question in question_rows
        }

        if len(question_map) != len(issued_ids):
            raise HTTPException(
                status_code=400,
                detail="Some questions in this quiz no longer exist."
            )

        score = 0
        results = []

        # Preserve the original question order.
        answers_map = {
            answer.question_id: answer
            for answer in submission.answers
        }

        for question_id in issued_ids:
            answer = answers_map[question_id]
            question = question_map[question_id]

            correct_index = (
                ord(question["correct_answer"].strip().upper()) - ord("A")
            )

            if not 0 <= correct_index <= 3:
                raise HTTPException(
                    status_code=500,
                    detail="Invalid correct answer in the question bank."
                )

            is_correct = answer.selected_option == correct_index

            if is_correct:
                score += 1

            results.append({
                "question_id": question["id"],
                "topic": question["topic"],
                "question": question["question"],
                "options": [
                    question["option_a"],
                    question["option_b"],
                    question["option_c"],
                    question["option_d"]
                ],
                "selected_option": answer.selected_option,
                "correct_option": correct_index,
                "is_correct": is_correct,
                "explanation": question["explanation"]
            })

        total = len(issued_ids)
        percentage = round((score / total) * 100, 2)

        cursor = db.execute(
            """
            INSERT INTO quiz_results (score, total)
            VALUES (?, ?)
            """,
            (score, total)
        )

        result_id = cursor.lastrowid

        db.execute(
            """
            UPDATE quiz_attempts
            SET submitted = 1
            WHERE id = ?
            """,
            (submission.attempt_id,)
        )

        db.commit()

    return {
        "message": "Quiz submitted successfully!",
        "result_id": result_id,
        "score": score,
        "total": total,
        "percentage": percentage,
        "results": results
    }


# ---------------- ENVIRONMENTAL AWARENESS SURVEY ----------------

class SurveySubmission(BaseModel):
    waste_segregation: str
    water_conservation: str
    transport_method: str


@app.post("/survey/submit")
def submit_survey(survey: SurveySubmission):
    allowed_waste = ["Always", "Sometimes", "Never"]
    allowed_water = ["Always", "Sometimes", "Never"]

    allowed_transport = [
        "Walking",
        "Cycling",
        "Public transport",
        "Private vehicle"
    ]

    if survey.waste_segregation not in allowed_waste:
        raise HTTPException(
            status_code=400,
            detail="Invalid waste segregation response."
        )

    if survey.water_conservation not in allowed_water:
        raise HTTPException(
            status_code=400,
            detail="Invalid water conservation response."
        )

    if survey.transport_method not in allowed_transport:
        raise HTTPException(
            status_code=400,
            detail="Invalid transport method."
        )

    with get_db() as db:
        cursor = db.execute(
            """
            INSERT INTO surveys (
                waste_segregation,
                water_conservation,
                transport_method
            )
            VALUES (?, ?, ?)
            """,
            (
                survey.waste_segregation,
                survey.water_conservation,
                survey.transport_method
            )
        )

        survey_id = cursor.lastrowid
        db.commit()

    return {
        "message": "Survey submitted successfully!",
        "survey_id": survey_id,
        "responses": {
            "waste_segregation": survey.waste_segregation,
            "water_conservation": survey.water_conservation,
            "transport_method": survey.transport_method
        }
    }


# ---------------- DASHBOARD STATISTICS ----------------

@app.get("/dashboard/stats")
def get_dashboard_stats():
    with get_db() as db:
        total_campaigns = db.execute(
            "SELECT COUNT(*) FROM campaigns"
        ).fetchone()[0]

        total_registrations = db.execute(
            "SELECT COUNT(*) FROM registrations"
        ).fetchone()[0]

        total_quiz_attempts = db.execute(
            "SELECT COUNT(*) FROM quiz_results"
        ).fetchone()[0]

        average_result = db.execute(
            """
            SELECT AVG(
                CASE
                    WHEN total > 0 THEN
                        (CAST(score AS REAL) / total) * 100
                    ELSE 0
                END
            )
            FROM quiz_results
            """
        ).fetchone()[0]

        total_survey_responses = db.execute(
            "SELECT COUNT(*) FROM surveys"
        ).fetchone()[0]

        total_quiz_questions = db.execute(
            "SELECT COUNT(*) FROM quiz_questions"
        ).fetchone()[0]

    return {
        "total_campaigns": total_campaigns,
        "total_registrations": total_registrations,
        "total_quiz_attempts": total_quiz_attempts,
        "average_quiz_percentage": round(average_result or 0, 2),
        "total_survey_responses": total_survey_responses,
        "total_quiz_questions": total_quiz_questions
    }


# ---------------- VIEW SURVEY RESPONSES ----------------

@app.get("/survey/responses")
def get_survey_responses():
    with get_db() as db:
        rows = db.execute(
            """
            SELECT id, waste_segregation,
                   water_conservation, transport_method, submitted_at
            FROM surveys
            ORDER BY id DESC
            """
        ).fetchall()

    return {
        "total_responses": len(rows),
        "responses": [dict(row) for row in rows]
    }
