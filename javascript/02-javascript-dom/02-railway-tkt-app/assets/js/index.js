const formEl = document.forms.ticketForm;
const addPassengersBtnEl = document.querySelector("#addPassengers");
const bookTicketBtnEl = document.querySelector("#bookTicket");
const passengersListEl = document.querySelector("#passengerList");
const popUpEl = document.querySelector("#popUp");
const closeEl = document.querySelector("#close");
const formIDEl = document.querySelector("#form");
const passengersEls = document.querySelectorAll(".passenger");
const dateOfJourneySubmitedEl = document.querySelector(
  "#dateOfJourneySubmited"
);
const fromStationSubmitedEl = document.querySelector("#fromStationSubmited");
const toStationSubmitedEl = document.querySelector("#toStationSubmited");
const trainNumSubmitedEl = document.querySelector("#trainNumSubmited");

const olEl = document.querySelector("ol");

let passengersObjsArr = [];
let finalObj = null;

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formEl);

  // console.log(Object.fromEntries(formData)); // return all data in unstructure way
  const formDataObj = Object.fromEntries(formData);

  // loop to push individual passengers to arr
  for (let index = 0; index <= 5; index++) {
    if (
      formDataObj[`passenger${index}Age`] &&
      formDataObj[`passenger${index}Gender`] &&
      formDataObj[`passenger${index}Name`]
    ) {
      passengersObjsArr.push({
        passengerAge: formDataObj[`passenger${index}Age`],
        passengerGender: formDataObj[`passenger${index}Gender`],
        passengerName: formDataObj[`passenger${index}Name`],
      });
    }
  }
  const journeyData = {
    trainNum: formDataObj["trainNum"],
    toStation: formDataObj["toStation"],
    fromStation: formDataObj["fromStation"],
    dateOfJourney: formDataObj["dateOfJourney"],
    passengersDetails: passengersObjsArr,
  };

  finalObj = journeyData;

  // console.log(journeyData); // structured data for appending to  server
  // converting journeyDate -> JSON
  const jsonData = JSON.stringify(journeyData);
  // const jsonData = journeyData;
  console.log(jsonData);
  console.log(finalObj);
  // Send to Backend
  const url = "http://localhost:3000/tickets";

  const postMethod = async (json, url) => {
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
  };
  postMethod(jsonData, url);

  if (finalObj != null) {
    dateOfJourneySubmitedEl.innerText = `Date of Journey : ${finalObj.dateOfJourney}`;
    fromStationSubmitedEl.innerText = `From : ${finalObj.fromStation}`;
    toStationSubmitedEl.innerText = `To : ${finalObj.toStation}`;
    trainNumSubmitedEl.innerText = `Train no : ${finalObj.trainNum}`;

    olEl.innerHTML = ``;

    finalObj.passengersDetails.forEach((passenger, index) => {
      olEl.innerHTML += `<li class="p-4 my-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-md"> ${
        index + 1
      } .  ${passenger.passengerName}</li>`;
    });
  }

  // removing existing inputs
  formEl.reset();
  resetStyles();
  passengersObjsArr = [];

  // removing empty extra passengers input elements
  if (passengersListEl.children.length > 1) {
    for (let i = passengersListEl.children.length; i > 1; i--) {
      // console.log(i);
      passengersListEl.children[i - 1].remove();
    }
  }
  // swaping ui
  formIDEl.style.display = "none";
  popUpEl.style.display = "block";
});

addPassengersBtnEl.addEventListener("click", (e) => {
  e.preventDefault();

  validateForm(formEl);

  let checkedRadioState = [];
  let checkedRadioEl = [];

  // validate gender
  [...formEl].forEach((element) => {
    if (element.type === "radio") {
      if (element.checked) {
        checkedRadioState.push(element.checked);
        checkedRadioEl.push(element);
        element.closest(".gender-div").children[1].innerText = "";
      } else {
        element.closest(".gender-div").children[1].innerText =
          "Please Select Gender";
        errStyle("red", element.parentElement.parentElement);
      }
    }
  });
  checkedRadioEl.forEach((genderElement) => {
    if (genderElement.checked) {
      defaultErrState(
        genderElement.closest(".gender-div").children[1],
        genderElement.parentElement.parentElement
      );
    }
  });

  let childLength = passengersListEl.children.length + 1;

  // check the use enters his details
  if (
    checkedRadioState[childLength] == true ||
    checkedRadioState[childLength - 2] == true
  ) {
    // members upto 5 only

    // appending html el
    const divEl = document.createElement("div");
    const hrEl = document.createElement("hr");
    hrEl.classList.add("my-3");

    const nameEl = createInput(
      childLength,
      `passenger${childLength}Name`,
      "text",
      `Enter passenger ${childLength} Name`,
      `Enter passenger ${childLength} Name`
    );
    const gender = ["Male", "Female", "Others"];
    const ageEl = createInput(
      childLength,
      `passenger${childLength}Age`,
      "number",
      `Enter passenger ${childLength} Age`,
      `Enter passenger ${childLength} Age`
    );

    if (childLength < 6) {
      divEl.append(nameEl, radioCollection(gender, childLength), ageEl, hrEl);
      passengersListEl.append(divEl);
    } else {
      addPassengersBtnEl.nextElementSibling.textContent =
        "You can add upto 5 Passenegrs only ";
      setTimeout(() => {
        addPassengersBtnEl.nextElementSibling.textContent = "";
      }, 3000);
    }
  }
});

bookTicketBtnEl.addEventListener("click", (e) => {
  validateForm(formEl);

  let checkedRadioState = [];
  let checkedRadioEl = [];

  [...formEl].forEach((element) => {
    if (element.type === "radio") {
      if (element.checked) {
        checkedRadioState.push(element.checked);
        checkedRadioEl.push(element);
        element.closest(".gender-div").children[1].innerText = "";
      } else {
        element.closest(".gender-div").children[1].innerText =
          "Please Select Gender";
        errStyle("red", element.parentElement.parentElement);
      }
    }
  });

  checkedRadioEl.forEach((genderElement) => {
    if (genderElement.checked) {
      defaultErrState(
        genderElement.closest(".gender-div").children[1],
        genderElement.parentElement.parentElement
      );
    }
  });
});

formEl.addEventListener("change", (e) => {
  const target = e.target;
  const parentEl = target.parentElement;
  const smallEl = parentEl.querySelector("small");

  if (target.type == "text") {
    // balnk input check
    if (Emptystring(target.value)) {
      defaultErrState(smallEl, target);
      // string leng > 3 check
      if (validName(target.value)) {
        defaultErrState(smallEl, target);
      } else {
        // console.log(target.value, "string < 3");
        errStyle("red", target);
        smallEl.innerText = "Entered Value is  not Valid!";
      }
    } else {
      errStyle("red", target);
      target.value = "";
      target.placeholder = "input cannot be blank.";
      smallEl.innerText = "input cannot be blank.";
    }
  } else if (target.type == "number") {
    // check train number
    if (target.id == "trainNum" && Between(target.value, 1000, 99999))
      defaultErrState(smallEl, target);
    // check age
    else if (target.id != "trainNum" && Between(target.value, 5, 110)) {
      defaultErrState(smallEl, target);
      // false in train no , age
    } else {
      errStyle("red", target);
      smallEl.innerText = "Entered Value is  not Valid!";
    }
  } else if (target.type == "date") {
    if (Emptystring(target.value)) {
      errStyle("green", target);
      defaultErrState(smallEl, target);
    } else {
      errStyle("red", target);
      smallEl.innerText = "Entered data is  not Valid!";
    }
  } else if (target.type == "radio") {
    let checkedRadioState = [];
    let checkedRadioEl = [];

    if (target.checked) {
      checkedRadioState.push(target.checked);
      checkedRadioEl.push(target);
      // console.log(checkedRadioEl)smallEl
    }
    checkedRadioEl.forEach((genderElement) => {
      if (genderElement.checked) {
        genderElement.closest(".gender-div").children[1].innerText = "";
        errStyle("green", genderElement.parentElement.parentElement);
      }
    });
  }
});

closeEl.addEventListener("click", () => {
  formIDEl.style.display = "block";
  popUpEl.style.display = "none";
});

// utility functions

function createInput(count, passengerData, inputType, labelTxt, placeholder) {
  // create el
  const divEl = document.createElement("div");
  const labelEl = document.createElement("label");
  const inputEl = document.createElement("input");
  const smallEl = document.createElement("small");

  // add classes
  divEl.classList.add("flex", "flex-col", "gap-3", "mt-2");
  inputEl.classList.add("passenger", "p-2");

  // setting attributes
  if (inputType == "number" && passengerData == `passenger${count}Age`) {
    inputEl.setAttribute("min", 1);
    inputEl.setAttribute("max", 110);
  }

  labelEl.setAttribute("for", passengerData);

  inputEl.setAttribute("type", inputType);
  inputEl.setAttribute("id", passengerData);
  inputEl.setAttribute("name", passengerData);
  inputEl.setAttribute("placeholder", placeholder);
  inputEl.setAttribute("required", "required");

  labelEl.innerText = labelTxt;

  //   appending
  divEl.append(labelEl, inputEl, smallEl);

  return divEl;
}

function radioCollection(arr, count) {
  const parentDiv = document.createElement("div");
  const divEl = document.createElement("div");
  const smallEl = document.createElement("small");

  parentDiv.classList.add("gender-div", "space-y-2", "mt-2");

  divEl.classList.add("radio-collection", "flex", "justify-between", "p-3");

  for (let index = 0; index < arr.length; index++) {
    divEl.appendChild(
      createRadioButton(count, arr[index], arr[index], arr[index])
    );
  }
  parentDiv.append(divEl, smallEl);

  return parentDiv;
}

function createRadioButton(count, id, value, labelText) {
  let name = `passenger${count}Gender`;

  var radioDiv = document.createElement("div");

  var input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("name", name);
  input.setAttribute("id", `${id.toLowerCase()}${count}`);
  input.setAttribute("value", value.toLowerCase());
  input.setAttribute("required", "required");

  input.style.margin = "6px";

  var label = document.createElement("label");
  label.setAttribute("for", `${id.toLowerCase()}${count}`);
  label.textContent = labelText;

  radioDiv.append(input, label);

  return radioDiv;
}

const Emptystring = (value) => (value.trim() === "" ? false : true);
const validName = (name) => (name.length < 3 ? false : true);

const Between = (value, min, max) =>
  value < min || value > max ? false : true;

function errStyle(color, element) {
  element.style.borderColor = color;
  element.style.borderWidth = "2px";
}

function resetStyles() {
  [...formEl].forEach((element) => {
    if (element.type == "radio") {
      element.parentElement.parentElement.style.borderColor = "none";
      element.parentElement.parentElement.style.borderWidth = "0px";
    }
    element.style.borderColor = "none";
    element.style.borderWidth = "0px";
  });
}

function defaultErrState(element, target) {
  element.innerText = "";
  errStyle("green", target);
}

function validateForm(formEl) {
  [...formEl].forEach((element) => {
    const parentEl = element.parentElement;
    const smallEl = parentEl.querySelector("small");
    if (element.type == "text") {
      // balnk input check
      if (Emptystring(element.value)) {
        defaultErrState(smallEl, element);
        // string leng > 3 check
        if (validName(element.value)) {
          defaultErrState(smallEl, element);
        } else {
          // console.log(target.value, "string < 3");
          errStyle("red", element);
          smallEl.innerText = "Entered Value is  not Valid!";
        }
      } else {
        errStyle("red", element);
        element.value = "";
        element.placeholder = "input cannot be blank.";
        smallEl.innerText = "input cannot be blank.";
      }
    } else if (element.type == "number") {
      // check train number
      if (element.id == "trainNum" && Between(element.value, 1000, 99999))
        defaultErrState(smallEl, element);
      // check age
      else if (element.id != "trainNum" && Between(element.value, 5, 110)) {
        defaultErrState(smallEl, element);
        // false in train no , age
      } else {
        errStyle("red", element);
        smallEl.innerText = "Entered Value is  not Valid!";
      }
    } else if (element.type == "date") {
      if (Emptystring(element.value)) {
        errStyle("green", element);
      } else {
        errStyle("red", element);
        smallEl.innerText = "Entered data is  not Valid!";
      }
    }
  });
}
