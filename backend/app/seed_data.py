import json

DEMO_USER_ID = "demo-rahul-cse"

RAHUL_PROFILE = {
    "id": DEMO_USER_ID,
    "name": "Rahul",
    "degree": "B.Tech",
    "branch": "CSE",
    "year": "4th Year",
    "cgpa": 8.2,
    "skills": ["Java", "Python", "SQL", "HTML/CSS", "Git", "REST APIs"],
    "programming_languages": ["Java", "Python", "SQL", "JavaScript"],
    "projects": [
        "Face Recognition Attendance System (Python, OpenCV, SQLite)",
        "Campus Placement Management Portal (React, FastAPI, PostgreSQL)"
    ],
    "internships": [
        "Summer Software Intern at Infotech Labs (2 months - backend API development)"
    ],
    "certifications": [
        "Oracle Certified Java Associate",
        "HackerRank SQL (Advanced) Certificate"
    ],
    "preferred_role": "Software Developer",
    "target_companies": ["TCS Digital", "Infosys SP", "Amazon", "Wipro Turbo", "Cognizant"],
    "interview_experience": "Beginner",
    "weak_areas": ["Complex SQL Joins", "Nervous in behavioral questions", "Explaining project bottlenecks"],
    "readiness_score": 59.0,
    "technical_score": 65.0,
    "communication_score": 58.0,
    "resume_score": 72.0,
    "hr_score": 45.0,
    "confidence_score": 55.0
}

RAHUL_RESUME_TEXT = """RAHUL SHARMA
Email: rahul.sharma@example.edu | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/rahul-sharma-cse
GitHub: github.com/rahul-cse

OBJECTIVE
Motivated 4th-year Computer Science Engineering student with strong problem-solving skills and hands-on experience in Java, Python, and web development. Seeking an entry-level Software Developer role at a forward-thinking technology company.

EDUCATION
B.Tech in Computer Science and Engineering | CGPA: 8.2 / 10.0 | 2023 – 2027
National Institute of Technology
Higher Secondary Certificate (HSC) | 91.4% | 2023

TECHNICAL SKILLS
Languages: Java, Python, SQL, JavaScript, C++
Frameworks & Libraries: Spring Boot basics, FastAPI, React, OpenCV
Databases: MySQL, SQLite, PostgreSQL
Tools & Platforms: Git, GitHub, VS Code, Postman, Linux basics
Core Concepts: Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS, Operating Systems, Computer Networks

PROJECTS
Face Recognition Attendance System | Python, OpenCV, SQLite
- Developed an automated classroom attendance system using OpenCV Haar-cascades and LBPH face recognition.
- Processed 50+ student face embeddings with a recognition accuracy of 92% under standard classroom lighting.
- Reduced manual attendance logging time by 80% with automated daily CSV and SQLite export.

Campus Placement Management Portal | React, FastAPI, SQLite
- Built a web portal for 600+ students to register for campus placement drives and track application status.
- Designed RESTful API endpoints for student profile management, company job postings, and slot booking.
- Implemented JWT-based authentication with role-based access control for students and placement coordinators.

INTERNSHIP EXPERIENCE
Software Development Intern | Infotech Labs, Bangalore | June 2026 – August 2026
- Collaborated with senior engineers to migrate legacy REST endpoints to async FastAPI services.
- Optimized database queries for student record fetching, reducing API response latency by 25%.
- Wrote automated unit tests with Pytest achieving 85% test coverage for user authentication modules.

CERTIFICATIONS
- Oracle Certified Associate: Java SE Programmer
- HackerRank 5-Star Coder (Java & SQL)
- Complete SQL Bootcamp Certificate (Udemy)

ACHIEVEMENTS & EXTRACURRICULAR
- 2nd Place, Intra-College Hackathon (48-hour prototype of Smart Campus Navigation).
- Technical Coordinator, Campus Computer Science Society (organized workshops for 150+ juniors).
"""

RAHUL_HISTORICAL_PROGRESS = [
    {
        "interview_number": 1,
        "date": "2026-08-10",
        "role": "Software Developer",
        "overall_score": 54.0,
        "technical_score": 52.0,
        "communication_score": 48.0,
        "problem_solving_score": 55.0,
        "hr_score": 46.0,
        "project_score": 60.0,
        "notes": "First ever mock interview. Candidate spoke too fast and used frequent filler words ('um', 'like'). Struggles with SQL joins."
    },
    {
        "interview_number": 2,
        "date": "2026-08-18",
        "role": "Software Developer",
        "overall_score": 63.0,
        "technical_score": 62.0,
        "communication_score": 58.0,
        "problem_solving_score": 65.0,
        "hr_score": 55.0,
        "project_score": 70.0,
        "notes": "Good improvement on OOP concepts. Project explanation was clearer. HR answers lacked the STAR method."
    },
    {
        "interview_number": 3,
        "date": "2026-08-27",
        "role": "Software Developer",
        "overall_score": 71.0,
        "technical_score": 72.0,
        "communication_score": 66.0,
        "problem_solving_score": 72.0,
        "hr_score": 68.0,
        "project_score": 78.0,
        "notes": "Strong grasp on Face Recognition architecture. Better eye contact and voice modulation. Still needs work on indexing & normalization."
    },
    {
        "interview_number": 4,
        "date": "2026-09-04",
        "role": "Software Developer",
        "overall_score": 78.0,
        "technical_score": 80.0,
        "communication_score": 72.0,
        "problem_solving_score": 80.0,
        "hr_score": 74.0,
        "project_score": 84.0,
        "notes": "Confident responses. Handled dynamic technical follow-ups effectively. Communication structure followed Present-Past-Future model."
    }
]

ETIQUETTE_SCENARIOS = [
    {
        "id": "scenario-knock",
        "title": "Entering the Interview Room",
        "category": "Entering",
        "context": "You arrive at the interview room door 10 minutes ahead of your scheduled slot. The door is closed.",
        "interviewer_prompt": "You gently knock on the door twice. The interviewer inside calls out: 'Come in.' What do you do next?",
        "options": [
            {"id": "A", "text": "Push the door wide open quickly, walk right up to the desk, and sit down immediately."},
            {"id": "B", "text": "Open the door smoothly, make pleasant eye contact, greet with 'Good morning/afternoon, Sir/Ma'am', close the door softly behind you, and stand beside the chair."},
            {"id": "C", "text": "Keep standing outside and knock once more to be doubly sure before entering."},
            {"id": "D", "text": "Walk in while glancing at your phone to double check your resume details."}
        ],
        "correct_option": "B",
        "explanation": "Proper corporate etiquette requires entering quietly, closing the door gently without turning your back fully, greeting the interviewers warmly with eye contact, and standing respectfully beside the chair until invited to sit."
    },
    {
        "id": "scenario-seat",
        "title": "Sitting Etiquette",
        "category": "Sitting",
        "context": "You have entered the room and greeted the panel. The chair is right in front of the interview desk.",
        "interviewer_prompt": "The lead interviewer smiles and says: 'Please have a seat, Rahul.' What is your immediate reaction?",
        "options": [
            {"id": "A", "text": "Say 'Thank you, Sir/Ma'am', pull the chair smoothly without scraping it on the floor, sit upright with feet flat, and place hands comfortably on your lap or the desk edge."},
            {"id": "B", "text": "Sit down immediately without saying anything and lean back comfortably with arms crossed."},
            {"id": "C", "text": "Place your heavy backpack directly onto the interview table in front of the panel."},
            {"id": "D", "text": "Decline the seat saying you prefer to stand during the interview."}
        ],
        "correct_option": "A",
        "explanation": "Always thank the interviewer before sitting. Maintain an attentive, upright posture with relaxed shoulders and hands resting gently. Never place personal bags or clutter on the interviewer's table."
    },
    {
        "id": "scenario-disagree",
        "title": "Handling Interviewer Disagreement / Correction",
        "category": "Disagreement",
        "context": "During the technical round, you explained binary search tree operations.",
        "interviewer_prompt": "The interviewer frowns slightly and remarks: 'I don't think your time complexity analysis for the worst-case BST search is correct.' How do you respond?",
        "options": [
            {"id": "A", "text": "Firmly state: 'No, I studied this thoroughly and I am 100% positive my textbook says O(log N).'"},
            {"id": "B", "text": "Thank you for pointing that out, Sir/Ma'am. Let me reconsider: in the worst case where the BST degenerates into a skewed linked list, the height becomes N, so search time would indeed be O(N). I appreciate the clarification.'"},
            {"id": "C", "text": "Become silent, look at the floor, and wait for the interviewer to change the question."},
            {"id": "D", "text": "Say: 'Whatever you say, Sir, let's just move to the next question.'"}
        ],
        "correct_option": "B",
        "explanation": "Interviewers frequently test your receptiveness to feedback and intellectual humility. Acknowledge their point respectfully, re-evaluate your reasoning out loud, and demonstrate that you can collaborate constructively."
    },
    {
        "id": "scenario-dont-know",
        "title": "When You Don't Know the Answer",
        "category": "Problem Solving",
        "context": "The interviewer asks an advanced question about B-Tree index internals that you haven't studied in depth.",
        "interviewer_prompt": "Interviewer: 'Can you explain the exact page splitting mechanism in B+ Tree insertion when a leaf node overflows?' What is your best move?",
        "options": [
            {"id": "A", "text": "Make up an elaborate technical-sounding guess hoping they won't notice."},
            {"id": "B", "text": "State honestly: 'I am not deeply familiar with the exact page-splitting mechanism of B+ Trees, but from what I understand of tree balancing, when a node exceeds maximum keys it splits and promotes the middle key. Would you like me to walk through how I'd approach tree balancing generally, or could you give a small hint?'"},
            {"id": "C", "text": "Instantly answer: 'I don't know, next question please.'"},
            {"id": "D", "text": "Complain that this topic was not taught in your college syllabus."}
        ],
        "correct_option": "B",
        "explanation": "Honesty coupled with structured thinking and willingness to learn is prized by recruiters. Never bluff in technical interviews—acknowledge the boundary of your knowledge and share related foundational logic."
    },
    {
        "id": "scenario-closing",
        "title": "Candidate Closing Questions",
        "category": "Closing",
        "context": "The interview is drawing to a close after 35 minutes.",
        "interviewer_prompt": "The interviewer asks: 'Rahul, do you have any questions for us before we wrap up?' How do you respond?",
        "options": [
            {"id": "A", "text": "'No questions, everything was clear. When will you give the offer letter?'"},
            {"id": "B", "text": "'Yes, could you share what tech stack the team currently uses for modern microservices, and what learning opportunities a graduate engineer can expect during the first six months?'"},
            {"id": "C", "text": "'How many sick leaves do freshers get each month?'"},
            {"id": "D", "text": "'Did I pass this round or did I fail?'"}
        ],
        "correct_option": "B",
        "explanation": "Asking thoughtful questions about technology stacks, engineering practices, or onboarding learning demonstrates genuine curiosity and professional foresight. Avoid premature questions regarding leaves, salary, or instant hiring decisions."
    }
]

BRANCH_TECHNICAL_BANK = {
    "CSE": [
        {
            "category": "Object-Oriented Programming (OOP)",
            "question": "What are the 4 pillars of OOP, and can you explain Polymorphism with a real-world example?",
            "difficulty": "Beginner",
            "core_concept": "Encapsulation, Abstraction, Inheritance, Polymorphism (Compile-time vs Run-time)",
            "ideal_answer_points": [
                "Encapsulation: Bundling data and methods into a single unit and restricting direct access via getters/setters.",
                "Abstraction: Hiding internal implementation complexities and exposing only essential interfaces.",
                "Inheritance: Mechanism where a child class acquires properties of a parent class to foster reusability.",
                "Polymorphism: 'Many forms' - method overloading (compile-time) vs method overriding (run-time, e.g., Shape.draw() called on Circle or Square)."
            ],
            "common_mistakes": ["Confusing overloading with overriding", "Forgetting run-time dynamic dispatch"]
        },
        {
            "category": "Database Management Systems (DBMS)",
            "question": "What is the difference between WHERE and HAVING clauses in SQL, and why does HAVING require GROUP BY?",
            "difficulty": "Intermediate",
            "core_concept": "Row filtering vs Aggregate filtering, Query Execution Order",
            "ideal_answer_points": [
                "WHERE filters rows before any group-by aggregation occurs.",
                "HAVING filters aggregated groups based on aggregate functions like COUNT(), AVG(), or SUM().",
                "SQL execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY."
            ],
            "common_mistakes": ["Using aggregate functions inside WHERE", "Not understanding query execution pipeline"]
        },
        {
            "category": "Operating Systems (OS)",
            "question": "What is the difference between a Process and a Thread, and what is a Deadlock with its 4 necessary conditions?",
            "difficulty": "Intermediate",
            "core_concept": "Process vs Thread memory space, Coffman conditions for deadlock",
            "ideal_answer_points": [
                "Process has independent address space; Threads share address space and resources within the same process.",
                "Deadlock is a state where a set of processes are blocked because each holds a resource and waits for another held by another process.",
                "4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait."
            ],
            "common_mistakes": ["Forgetting Coffman condition names", "Confusing multithreading with multiprocessing"]
        },
        {
            "category": "Data Structures & Algorithms (DSA)",
            "question": "How does a Hash Map handle collisions under the hood, and what is the difference between Chaining and Open Addressing?",
            "difficulty": "Advanced",
            "core_concept": "Hashing collisions, Separate Chaining (Linked Lists / Red-Black Trees), Open Addressing (Linear Probing)",
            "ideal_answer_points": [
                "Hash collision happens when two distinct keys produce the identical hash index.",
                "Chaining stores colliding items in a bucket using a linked list or self-balancing BST (like Java 8 HashMap).",
                "Open Addressing probes alternative empty slots in the table (Linear probing, Quadratic probing, Double hashing)."
            ],
            "common_mistakes": ["Not knowing what happens when a bucket grows large (Treeification in Java 8)", "Confusing load factor"]
        }
    ],
    "IT": [
        {
            "category": "Web & Cloud Architecture",
            "question": "What happens behind the scenes when you type a URL into your browser and press Enter?",
            "difficulty": "Beginner",
            "core_concept": "DNS Resolution, TCP 3-Way Handshake, TLS/SSL negotiation, HTTP Request/Response, DOM rendering",
            "ideal_answer_points": [
                "Browser checks browser cache, OS cache, router cache, ISP DNS.",
                "DNS lookup resolves domain name to IP address.",
                "TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) and TLS encryption handshake.",
                "Browser sends HTTP GET; server processes and returns HTML/CSS/JS.",
                "Browser parses DOM and CSSOM to build Render Tree and paint pixels."
            ],
            "common_mistakes": ["Skipping DNS cache levels", "Omitting TCP handshake details"]
        },
        {
            "category": "RESTful API Design",
            "question": "What makes an API truly RESTful, and what is the difference between PUT and PATCH methods?",
            "difficulty": "Intermediate",
            "core_concept": "Statelessness, Uniform Interface, Idempotency, PUT (complete replacement) vs PATCH (partial update)",
            "ideal_answer_points": [
                "REST relies on stateless communication, cacheability, and client-server decoupling.",
                "PUT is idempotent and replaces the target resource entirely.",
                "PATCH applies partial modifications to a resource and is not strictly required to be idempotent."
            ],
            "common_mistakes": ["Thinking PUT and PATCH are identical", "Forgetting idempotency definition"]
        }
    ],
    "ECE": [
        {
            "category": "Digital Electronics",
            "question": "What is the difference between Combinational and Sequential circuits, and what is the significance of Setup and Hold times in flip-flops?",
            "difficulty": "Intermediate",
            "core_concept": "Memory elements, Clock synchronization, Setup and Hold timing margins",
            "ideal_answer_points": [
                "Combinational circuits depend solely on current inputs (no clock, no memory, e.g. MUX, Adder).",
                "Sequential circuits depend on current inputs and past states via memory elements (e.g. Flip-Flops, Registers).",
                "Setup time: Minimum time data input must remain stable BEFORE the active clock edge.",
                "Hold time: Minimum time data input must remain stable AFTER the active clock edge to prevent metastability."
            ],
            "common_mistakes": ["Confusing setup with hold time", "Ignoring metastability consequences"]
        },
        {
            "category": "Microprocessors & Embedded Systems",
            "question": "What is the difference between Harvard and Von Neumann architectures, and what is an Interrupt Service Routine (ISR)?",
            "difficulty": "Intermediate",
            "core_concept": "Instruction vs Data buses, Memory bottleneck, Hardware interrupts",
            "ideal_answer_points": [
                "Von Neumann shares a single memory bus for instructions and data (creating the Von Neumann bottleneck).",
                "Harvard provides separate buses for program memory and data memory, allowing simultaneous fetch and data read/write.",
                "An ISR is a specialized routine invoked asynchronously by hardware/software interrupts to handle urgent events."
            ],
            "common_mistakes": ["Writing blocking or delay loops inside an ISR", "Failing to explain separate buses in Harvard"]
        }
    ],
    "EEE": [
        {
            "category": "Electrical Machines & Power Systems",
            "question": "Why does a 3-phase Induction Motor need a starter, and what is the working principle of a Transformer?",
            "difficulty": "Intermediate",
            "core_concept": "Faraday's Law of Mutual Induction, Inrush starting current, Back EMF",
            "ideal_answer_points": [
                "Transformers transfer AC electrical energy between circuits via mutual electromagnetic induction without frequency change.",
                "At start, back EMF in an induction motor is zero, drawing 5 to 7 times full-load current which can damage windings, requiring Star-Delta or DOL starters."
            ],
            "common_mistakes": ["Saying transformers work on DC", "Not mentioning zero initial back EMF"]
        }
    ],
    "Mechanical": [
        {
            "category": "Thermodynamics & IC Engines",
            "question": "What are the 4 strokes of a Four-Stroke Otto Cycle, and what is the difference between Otto and Diesel cycles?",
            "difficulty": "Beginner",
            "core_concept": "Suction, Compression, Power, Exhaust strokes, Spark ignition vs Compression ignition",
            "ideal_answer_points": [
                "4 strokes: Suction (air-fuel mixture drawn), Compression (piston moves TDC), Power/Expansion (spark ignited), Exhaust (burned gases expelled).",
                "Otto cycle adds heat at constant volume with spark ignition; Diesel cycle adds heat at constant pressure with high compression ignition."
            ],
            "common_mistakes": ["Confusing constant volume vs constant pressure heat addition", "Confusing 2-stroke and 4-stroke terminology"]
        }
    ],
    "Civil": [
        {
            "category": "Structural & Construction Engineering",
            "question": "What is the difference between One-way and Two-way slabs in reinforced concrete, and what is the slump test used for?",
            "difficulty": "Beginner",
            "core_concept": "Aspect ratio Ly/Lx, load distribution, Concrete workability and water-cement ratio",
            "ideal_answer_points": [
                "One-way slab has Ly/Lx >= 2 (bends primarily in shorter direction; supported on two opposite edges).",
                "Two-way slab has Ly/Lx < 2 (bends in both directions; supported on all four edges).",
                "The Slump test measures the consistency, workability, and fluidity of fresh concrete."
            ],
            "common_mistakes": ["Getting the Ly/Lx ratio reversed", "Assuming slump test measures compressive strength"]
        }
    ]
}
