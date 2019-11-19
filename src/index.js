import data from '../assets/questions';

const app = document.getElementById("root");

let questions = data;

const removeButtonComponent = id =>
  `<button class="btn btn--danger" onclick="methods.removeItem('${id}')">Remove</button>`;

const editButtonComponent = id =>
  `<button class="btn btn--primary btn--right-margin" onclick="methods.editItem('${id}')">Edit</button>`;

const okButtonComponent = id =>
  `<button class="btn btn--success btn--right-margin" onclick="methods.saveItem('${id}')">Ok</button>`;

const newItemInputComponent = ({ name, id, label, error }) => {
  return `
    <div class="post-form__container">
      <input class="post-form__input" onkeydown="methods.addNewItem(event)" type="text" name="${name}" id="${id}" required />
      <label class="post-form__label post-form__label--floating" for="${name}">${label}</label>
      <div class="post-form__border"></div>
      ${
        error
          ? `<div class="post-form__error post-form__error--hidden">${error}</div>`
          : ""
      }
    </div>
  `;
};

const editQuestionComponent = question =>
  `<input class="question-list__input question-list__input--large" id="edit-${question.id}" type="text" onkeyup="methods.saveInput('${question.id}', event)" value="${question.text}"></input>`;

const editAnswerComponent = (id, answer) =>
  `<input class="question-list__input question-list__input--medium" id="answer-${id}"  value="${answer}" onkeyup="methods.saveInput('${id}', event)" type="text" value="" placeholder="Type your answer here..."></input>`;

const star = (value, isChecked, id) =>
  `<input ${
    isChecked ? "checked" : ""
  } type="radio" id="${id}-${value}-stars" name="rating" value="${value}" onchange="methods.rate(event,'${id}')" />
  <label for="${id}-${value}-stars" class="star-rating ${
    isChecked ? "star-rating--checked" : ""
  }">&#9733;</label>`;

const ratingComponent = (id, rating) => {
  const stars = Array.from(Array(5).keys())
    .reverse()
    .map(num => star(num + 1, num + 1 === rating, id))
    .join(" ");

  return `<div class="question-list__star-rating">
            ${stars}
          </div>
          `;
};

const methods = {
  renderQuestions: () => {
    const questionListItems = questions.map(
      question => `
          <li class="question-list__item">
            <div class="question-list__header">
              <div class="question-list__btn-group">
                ${
                  question.isEditing
                    ? okButtonComponent(question.id)
                    : editButtonComponent(question.id)
                }
                ${removeButtonComponent(question.id)}
              </div>

              <span class="question-list__date">
                ${methods.formatDate(question.date)}
              </span>
            </div>

            ${ratingComponent(question.id, question.rating)}

            <div class="question-list__container">
             <div class="question-list__question">
              ${
                question.isEditing
                  ? editQuestionComponent(question)
                  : question.text
              }
             </div>

              <div class="question-list__answer">
                ${
                  !question.answer || question.isEditing
                    ? editAnswerComponent(question.id, question.answer)
                    : question.answer
                }
              </div>
            </div>
          </li>
        `
    );

    const questionNodes = `
      <ul class="question-list">
        ${questionListItems.join("")}
      </ul>
    `;

    app.innerHTML = `
      <div class="post-form">
        ${newItemInputComponent({
          name: "question",
          id: "question-input",
          label: "Question",
          error: "Question is required"
        })}
        ${newItemInputComponent({
          name: "answer",
          id: "answer-input",
          label: "Answer"
        })}
        </div>
      ${questionNodes.length > 0 ? questionNodes : ""}
    `;
  },

  removeItem: id => {
    questions = questions.filter(question => question.id !== id);

    methods.renderQuestions();
  },

  editItem: id => {
    questions = questions.map(question =>
      question.id === id ? { ...question, isEditing: true } : question
    );

    methods.renderQuestions();
  },

  saveItem: id => {
    const currentQuestion = questions.find(q => q.id === id);
    const questionInput = document.getElementById(`edit-${id}`);
    const text = questionInput ? questionInput.value : currentQuestion.text;
    const answerInput = document.getElementById(`answer-${id}`);
    const answer = answerInput ? answerInput.value : currentQuestion.answer;

    questions = questions.map(q =>
      q.id === id ? { ...q, isEditing: false, text, answer } : q
    );
    methods.renderQuestions();
  },

  saveInput: (id, event) => {
    if (event.keyCode === 13) {
      methods.saveItem(id);

      methods.renderQuestions();
    }
  },

  rate: (event, id) => {
    const rating = +event.target.value;
    questions = questions.map(question =>
      question.id === id ? { ...question, rating } : question
    );

    methods.renderQuestions();
  },

  addNewItem: event => {
    if (event.keyCode === 13) {
      const questionValue = document.getElementById("question-input").value;
      const answerValue = document.getElementById("answer-input").value;

      if (!questionValue) {
        methods.displayNoQuestionError();
      } else {
        questions = [
          {
            id: `${Date.now()}`,
            text: questionValue,
            answer: answerValue,
            date: Date.now(),
            rating: 0
          },
          ...questions
        ];

        methods.renderQuestions();

        document.getElementById("question-input").focus();
      }
    }
  },

  displayNoQuestionError: () => {
    const error = document
      .getElementById("question-input")
      .parentElement.querySelector(".post-form__error");
    error.classList.remove("post-form__error--hidden");
    error.classList.add("post-form__error--visible");
  },

  formatDate: timestamp => {
    return new Date(timestamp).toDateString();
  }
};


window.methods = methods;

methods.renderQuestions();