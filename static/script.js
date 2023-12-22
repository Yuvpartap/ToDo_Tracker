var add = document.getElementById("addToDo"); // fetching addTodDo button in add variable
var input = document.getElementById("inputField"); //fetching inputField in input variable
var toDoContainer = document.getElementById("toDoContainer"); //fetching toDoContainer in toDoContainer variable

var counter = 0; // counter variable is used to give id to each item

add.addEventListener("click", addItem); // when someone clicks add button, then addItem function will be called
input.addEventListener(
  "keypress", // keypress event is used to detect when someone presses any key
  function (e) {
    // when someone presses enter key, then addItem function will be called
    if (e.key == "Enter") {
      addItem();
    }
  }
);

function addItem(e) {
  // addItem function

  const item_value = input.value; // fetching value of inputField and storing it in item_value variable

  const item = document.createElement("div"); // creating div element as it can't be in index.html file as item
  item.classList.add("item"); // item = <div class="item"></div>
  // what is document here? document is the DOM (Document Object Model) of the HTML page. It is the root node of the
  // HTML document. It is the parent of all other nodes, such as text nodes, element nodes, and comment nodes.
  const item_content = document.createElement("div"); //item_content = <div class="content"></div>
  item_content.classList.add("content");

  item.appendChild(item_content); // <div class = "item"> <div class = "content"></div> </div>
  counter++; // incrementing counter by 1
  const serial_number = document.createElement("div");
  serial_number.classList.add("serial-number"); // serial_number = <div class="serial-number"></div>
  serial_number.innerText = "[" + counter + "]"; // counter is used to give serial number to each item
  item_content.appendChild(serial_number); // <div class = "item"> <div class = "content"> <div class="serial-number">1</div> </div> </div>

  const input_item = document.createElement("input"); // input_item = <input type="text" value="item_value" readonly>
  input_item.classList.add("text");
  input_item.type = "text";
  input_item.value = item_value;
  input_item.setAttribute("readonly", "readonly");
  input_item.addEventListener("dblclick", function () {
    input_item.style.textDecoration = "line-through";
  });
  item_content.appendChild(input_item); // <div class = "item"> <div class = "content"> <input type="text" value="item_value" readonly> </div> </div>

  const item_action = document.createElement("div");
  item_action.classList.add("actions"); // item_action = <div class="actions"></div>

  const edit_item = document.createElement("button");
  edit_item.classList.add("edit", "btn", "btn-success");
  edit_item.type = "button";
  edit_item.innerText = "Edit"; // edit_item = <button class="edit btn btn-success">Edit</button>

  const delete_item = document.createElement("button");
  delete_item.classList.add("delete", "btn", "btn-danger", "fa", "fa-trash"); // delete_item = <button class="delete btn btn-danger fa fa-trash"></button>

  item_action.appendChild(edit_item);
  item_action.appendChild(delete_item);

  item.appendChild(item_action);

  toDoContainer.appendChild(item); // <div class="toDoContainer"> <div class = "item"> <div class = "content"> <input type="text" value="item_value" readonly> </div> </div> </div>

  // updateTodoText(item_value, item);

  input.value = ""; // clearing inputField after adding item

  edit_item.addEventListener("click", (e) => {
    //(e) is event object
    if (edit_item.innerText.toLowerCase() == "edit") {
      edit_item.innerText = "Save"; //innerText is used to get the text of the element
      input_item.removeAttribute("readonly");
      input_item.focus(); //cursor will be on input_item
    } else {
      edit_item.innerText = "Edit";
      input_item.setAttribute("readonly", "readonly");
    }
  });

  // edit_item.addEventListener("click", (e) => {
  //   console.log("Edit button clicked");
  //   if (edit_item.innerText.toLowerCase() == "edit") {
  //     edit_item.innerText = "Save";
  //     input_item.removeAttribute("readonly");
  //     input_item.focus();
  //   } else {
  //     edit_item.innerText = "Edit";
  //     input_item.setAttribute("readonly", "readonly");

  //     // Send a request to update the todo text in the database
  //     const updatedText = input_item.value;
  //     updateTodoText(item_value, updatedText);
  //   }
  // });

  // function updateTodoText(oldText, item) {
  //   const input_item = item.querySelector(".text"); // Find the input element within the item

  //   console.log("Updating todo:", oldText, "to", input_item.value);

  //   fetch("/update_todo", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       oldText: oldText,
  //       newText: input_item.value,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Server response:", data);
  //       if (data.success) {
  //         console.log(data.message);
  //       } else {
  //         console.error(data.error);
  //       }
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }

  delete_item.addEventListener("click", (e) => {
    toDoContainer.removeChild(item);
    counter--;
    const item_value = input_item.value; // Access the item value within the event listener

    fetch("/delete_todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: item_value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  // delete_item.addEventListener("click", (e) => {
  //   console.log("Delete button clicked");
  //   const item = e.target.closest(".item");
  //   const item_value = item.querySelector(".text").value;
  //   toDoContainer.removeChild(item);
  //   counter--;

  //   // Send a request to delete the todo from the database
  //   deleteTodoText(item_value);
  // });

  // function deleteTodoText(text) {
  //   fetch("/delete_todo", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       text: text,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         console.log(data.message);
  //       } else {
  //         console.error(data.error);
  //       }
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }

  fetch("/add_todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: item_value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}
