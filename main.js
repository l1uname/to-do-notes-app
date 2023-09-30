(()=>{"use strict";function e(){document.querySelector("#date").value="",document.querySelector("#time").value="",document.querySelector("#priority").value="",document.querySelector("#description").value=""}function t(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var n=document.querySelector(".btn-open-form"),r=document.querySelector("#closeTodoFormButton"),i=document.querySelector(".btn-add-todo-item"),d=document.querySelector(".modal"),c=document.querySelector("#searchbox"),a=document.querySelector(".sort-items-by-type"),u=document.querySelector(".btn-start-now"),s=document.querySelector(".welcome-section"),l=document.querySelector(".todo-items"),m=function(){return document.querySelector(".todo-items").innerHTML=""},v=function(){return document.querySelector(".todo-item-description")},y=JSON.parse(localStorage.getItem("todoItems"))||[];function f(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y;if(m(),e(),t.length>0){s.classList.add("hidden"),localStorage.setItem("hideWelcome","true");var o,n=((o=document.createElement("div")).className="todo-item-description",o.innerHTML="\n        <div>Num:</div>\n        <div>Time:</div>\n        <div>Priority:</div>\n        <div>Description:</div>\n        <div>Actions</div>\n    ",o);l.appendChild(n),t.forEach((function(e,t){var o=function(e,t){var o=document.createElement("div");o.className="todo-item";var n,r="";if(e.date){var i=e.date.split("-");r="".concat(i[2],"/").concat(i[1]," ").concat(i[0])}return o.innerHTML='\n            <div class="todo-number">#'.concat(t+1,'</div>\n            <div class="todo-time-date">').concat(e.time," ").concat(r,'</div>\n            <div class="todo-priority">').concat((n=e.priority,n.charAt(0).toUpperCase()+n.slice(1)),'</div>\n            <div class="todo-description">').concat(e.description,'</div>\n            <div class="todo-actions">\n                <button class="todo-edit" data-index="').concat(t,'">Edit</button>\n                <button class="todo-done">Done</button>\n            </div>\n        '),o}(e,t);l.appendChild(o);var n,r=o.querySelector(".todo-edit"),c=o.querySelector(".todo-done");r.addEventListener("click",(function(e){!function(e){var t=y[e];document.querySelector("#date").value=t.date,document.querySelector("#time").value=t.time,document.querySelector("#priority").value=t.priority,document.querySelector("#description").value=t.description,i.textContent="Edit Todo",i.setAttribute("data-index",e),i.removeEventListener("click",p),i.addEventListener("click",S,{once:!0}),d.classList.remove("hidden"),document.querySelector("#description").focus()}(e.target.getAttribute("data-index"))})),clearTimeout(n),o.classList.remove("todo-item-done","todo-item-remove"),c.textContent="Done",c.addEventListener("click",(function(){"Done"===c.textContent?(o.classList.add("todo-item-done"),c.textContent="Undo",r.disabled=!0,n=setTimeout((function(){o.classList.add("todo-item-remove"),setTimeout((function(){if(o.classList.contains("todo-item-remove")&&(y.splice(t,1),localStorage.setItem("todoItems",JSON.stringify(y)),o.remove(),0===y.length)){var e=v();e&&e.remove(),s.classList.remove("hidden")}}),2500)}),1e3),document.addEventListener("keydown",(function(e){"Escape"===e.key&&c.click()}),{once:!0})):(clearTimeout(n),o.classList.remove("todo-item-done","todo-item-remove"),c.textContent="Done",r.disabled=!1)}))}))}else{s.classList.remove("hidden"),localStorage.setItem("hideWelcome","false");var r=v();r&&r.remove()}}function p(e){e.preventDefault();var t={date:document.querySelector("#date").value,time:document.querySelector("#time").value,priority:document.querySelector("#priority").value,description:document.querySelector("#description").value};y.push(t),f(),localStorage.setItem("todoItems",JSON.stringify(y)),d.classList.add("hidden"),i.textContent="Add Todo",i.removeEventListener("click",S),i.addEventListener("click",p,{once:!0})}function S(e){e.preventDefault();var t=i.getAttribute("data-index");y[t]={date:document.querySelector("#date").value,time:document.querySelector("#time").value,priority:document.querySelector("#priority").value,description:document.querySelector("#description").value},f(),localStorage.setItem("todoItems",JSON.stringify(y)),d.classList.add("hidden"),i.textContent="Add Todo",i.removeEventListener("click",S),i.addEventListener("click",p,{once:!0})}window.addEventListener("load",(function(){f();var e=localStorage.getItem("selectedSort");if(e){a.value=e;var t=new Event("change");a.dispatchEvent(t)}"true"===localStorage.getItem("hideWelcome")&&s.classList.add("hidden")}));var L=function(){var t=new Date,o=t.toISOString().substring(0,10),n=t.toTimeString().substring(0,5);d.classList.remove("hidden"),e(),i.textContent="Add Todo",i.removeEventListener("click",S),i.addEventListener("click",p,{once:!0}),document.querySelector("#date").value=o,document.querySelector("#time").value=n,document.querySelector("#priority").value="high",document.querySelector("#description").focus()};n.addEventListener("click",L),u.addEventListener("click",L),r.addEventListener("click",(function(){d.classList.add("hidden"),i.textContent="Add Todo",i.removeEventListener("click",S),i.addEventListener("click",p,{once:!0})})),document.querySelector(".todo-form").addEventListener("submit",(function(e){e.preventDefault(),"Add Todo"===i.textContent?p(e):S(e)})),c.addEventListener("input",(function(e){var t=e.target.value.toLowerCase();f(y.filter((function(e){return e.description.toLowerCase().includes(t)})))})),a.addEventListener("change",(function(e){var o,n=e.target.value;"date"===n?o=t(y).sort((function(e,t){var o=new Date(e.date.split("-").join(","));return new Date(t.date.split("-").join(","))-o})):"priority"===n?o=t(y).sort((function(e,t){var o={high:3,medium:2,low:1};return o[t.priority.toLowerCase()]-o[e.priority.toLowerCase()]})):"time"===n&&(o=t(y).sort((function(e,t){return t.time.localeCompare(e.time)}))),f(o),localStorage.setItem("selectedSort",n)})),document.addEventListener("keydown",(function(e){"Escape"===e.key&&d.classList.add("hidden")})),document.addEventListener("click",(function(e){e.target===d&&d.classList.add("hidden")}))})();