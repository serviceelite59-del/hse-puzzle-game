// Global variables
let userData = {};
let currentLevel = 1;
let score = 0;
const totalLevels = 5;

// Puzzle Data
const puzzles = [
  {
    id: 1,
    title: "Level 1: Hazard Spotter",
    type: "image",
    question: "Identify the main hazard here: Construction site without helmets, wet floor, exposed wires. What is the top priority risk?",
    options: ["Slipping", "Head injury from falling objects", "Electric shock"],
    correct: 1,
    explanation: "Head injury is the highest risk in construction — helmets are mandatory."
  },
  {
    id: 2,
    title: "Level 2: Match the Safety Rule",
    type: "match",
    pairs: [
      { left: "🔴 No Smoking", right: "Fire risk area" },
      { left: "🪖 Wear Helmet", right: "Head protection required" },
      { left: "♻️ Recycle", right: "Protect environment" }
    ]
  },
  {
    id: 3,
    title: "Level 3: Safe Sequence",
    type: "sequence",
    question: "Arrange evacuation steps correctly:",
    items: ["1. Sound alarm", "2. Leave via nearest exit", "3. Assemble at safe point", "4. Report to supervisor"],
    correctOrder: [0,1,2,3]
  },
  {
    id: 4,
    title: "Level 4: Environment Defender",
    type: "word",
    question: "Reducing, Reusing, and ______ are the 3Rs of environment.",
    answer: "Recycling"
  },
  {
    id: 5,
    title: "Level 5: Safety Scenario",
    type: "scenario",
    question: "You see a coworker lifting a box with a bent back. What do you do?",
    options: ["Ignore it", "Tell them correct lifting technique", "Laugh and walk away"],
    correct: 1,
    explanation: "Correct lifting prevents back injury — helping each other is part of safety culture."
  }
];

// DOM Elements
const registrationScreen = document.getElementById('registration-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const userForm = document.getElementById('userForm');

// Start game after form submission
userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userData = {
    name: document.getElementById('fullName').value,
    designation: document.getElementById('designation').value,
    company: document.getElementById('company').value,
    phone: document.getElementById('phone').value
  };
  // Update UI
  document.getElementById('playerName').textContent = userData.name;
  document.getElementById('playerCompany').textContent = userData.company;
  // Switch screen
  switchScreen(registrationScreen, gameScreen);
  loadLevel();
});

// Load current level
function loadLevel() {
  const puzzle = puzzles[currentLevel - 1];
  document.getElementById('level-title').textContent = puzzle.title;
  const content = document.getElementById('puzzle-content');
  content.innerHTML = '';
  document.getElementById('feedback').innerHTML = '';

  // Render based on type
  if (puzzle.type === 'image' || puzzle.type === 'scenario') {
    content.innerHTML = `<p>${puzzle.question}</p>`;
    puzzle.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(idx === puzzle.correct, puzzle.explanation);
      content.appendChild(btn);
    });
  } 
  else if (puzzle.type === 'word') {
    content.innerHTML = `
      <p>${puzzle.question}</p>
      <input type="text" id="wordAnswer" placeholder="Type your answer here">
      <button class="btn" onclick="checkWordAnswer('${puzzle.answer}')">Submit</button>
    `;
  }
  else if (puzzle.type === 'match') {
    puzzle.pairs.forEach((pair, i) => {
      const div = document.createElement('div');
      div.className = 'matching-pair';
      div.innerHTML = `<span>${pair.left}</span><span>${pair.right}</span>`;
      content.appendChild(div);
    });
    showFeedback(true, "Matching done — all pairs are correct! +20 Points");
    score += 20;
    updateScore();
  }
  else if (puzzle.type === 'sequence') {
    content.innerHTML = `<p>${puzzle.question}</p>`;
    puzzle.items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'sequence-item';
      div.textContent = item;
      div.draggable = true;
      content.appendChild(div);
    });
    // Simple auto-correct for demo
    setTimeout(() => { showFeedback(true, "Sequence correct! +20 Points"); score +=20; updateScore(); }, 500);
  }
}

// Check answers
function checkAnswer(isCorrect, explanation) {
  const feedback = document.getElementById('feedback');
  if (isCorrect) {
    feedback.className = 'feedback correct';
    feedback.textContent = `✅ Correct! ${explanation}`;
    score += 20;
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Incorrect. ${explanation}`;
  }
  updateScore();
}

function checkWordAnswer(correctAns) {
  const userAns = document.getElementById('wordAnswer').value.trim().toLowerCase();
  const feedback = document.getElementById('feedback');
  if (userAns === correctAns.toLowerCase()) {
    feedback.className = 'feedback correct';
    feedback.textContent = "✅ Correct! +20 Points";
    score += 20;
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Incorrect. Correct answer: ${correctAns}`;
  }
  updateScore();
}

function showFeedback(isCorrect, text) {
  const feedback = document.getElementById('feedback');
  feedback.className = isCorrect ? 'feedback correct' : 'feedback wrong';
  feedback.textContent = text;
}

function updateScore() {
  document.getElementById('score').textContent = score;
}

// Next level
document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentLevel < totalLevels) {
    currentLevel++;
    loadLevel();
  } else {
    // End game
    document.getElementById('finalName').textContent = userData.name;
    document.getElementById('finalScore').textContent = score;
    switchScreen(gameScreen, resultScreen);
  }
});

// Certificate download (simple text version)
document.getElementById('downloadCert').addEventListener('click', () => {
  const certText = `
    CERTIFICATE OF COMPLETION
    -------------------------
    This certifies that
    ${userData.name}
    Designation: ${userData.designation}
    Company: ${userData.company}
    
    has successfully completed the
    HSE Safety Smart Challenge
    with a score of ${score}/100
    
    Date: ${new Date().toLocaleDateString()}
  `;
  const blob = new Blob([certText], {type: 'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `HSE_Certificate_${userData.name}.txt`;
  a.click();
});

// Helper: Switch screens
function switchScreen(hide, show) {
  hide.classList.remove('active');
  show.classList.add('active');
}