const ideaForm = document.getElementById('modal-form');
const ideaUserName = document.getElementById('form-username');
const idea = document.getElementById('idea-textarea');
const ideaTag = document.getElementById('idea-tag');
const addIdeaBtn = document.getElementById('addIdea-btn');
const modalContainer = document.querySelector('.modal-container');
const deleteBtn = document.getElementById('delete');
const cards = document.querySelector('.cards');
const clearBtn = document.querySelector('.clear-btn');
const heading = document.querySelector('.heading h1');
const alert = document.querySelector('.alert');


function openModal(){
    modalContainer.style.display = 'block';
    setTimeout(() => {
        modalContainer.style.opacity = '1';
        },500)
}
function close(){
    modalContainer.style.opacity = '0';
    setTimeout(() => {
    modalContainer.style.display = 'none';
    },500);
}

function outsideClick(e){
e.target.parentElement === modalContainer ? close(): null;
}

function submitIdea(e){
    e.preventDefault();
if(ideaUserName.value === '' || idea.value === '' || ideaTag.value === '' ){
    showError('please fill all fields');
    return;
}else{
    showSuccess('You Add an idea')
}
const id = Date.now()
displayCard(ideaUserName.value, idea.value, ideaTag.value,id);
addIdeaToLocalStorag();
ideaUserName.value = '';
idea.value = '';
ideaTag.value = '';
document.dispatchEvent(new Event('closeModal'));
checkUI();
}


function displayCard(ideaUserName, idea, ideaTag, id = Date.now()){
const div = document.createElement('div');
div.classList.add('card');
div.setAttribute('data-Id',id);
const tagDiv = getTag(ideaTag);
div.innerHTML = `
   <div class="delete"><button type="button" class="delete-btn" title="btn"><i class="fa-solid fa-xmark" id="delete"></i></button></div>
        <h3 class="idea">${idea}</h3>
        <p class="tag ${tagDiv}">${ideaTag}</p>
        <h4 class="username">${ideaUserName}</h4>
      </div>
`;
cards.appendChild(div);
checkUI();
}


//Change the background of the tag of idea
const setTag = new Set();
setTag.add('technology');
setTag.add('software');
setTag.add('inventions');
setTag.add('health');
setTag.add('education');
setTag.add('business');
function getTag(tag){
tag.toLowerCase();
let tagClass = '';
if(setTag.has(tag)){
tagClass = `tag-${tag}`;
}else{
    tagClass = '';
}
return tagClass;
}
function removeIdeas(e){
    if(e.target.parentElement.classList.contains('delete-btn')){
        e.target.parentElement.parentElement.parentElement.remove();
        let ideasTostorage = getIdeaFromLocalStorage();
        ideasTostorage.forEach(idea => removeIdeasFromLocalStorage(idea.id)); 
            showError('You Removed an idea')  
}
checkUI();
}


//clear ideas
function clearAll(){
while(cards.firstChild){
cards.removeChild(cards.firstChild);
localStorage.clear();
checkUI();
}
}




function getIdeaFromLocalStorage(){
let ideasTostorage;
if(localStorage.getItem('ideas') === null){
ideasTostorage = [];
}else{
ideasTostorage = JSON.parse(localStorage.getItem('ideas'));
}
return ideasTostorage
}

function addIdeaToLocalStorag(){
let ideasTostorage = getIdeaFromLocalStorage();
const newItem = {ideaUserName:ideaUserName.value, idea:idea.value,ideaTag:ideaTag.value, id:Date.now()}
ideasTostorage.push(newItem);
localStorage.setItem('ideas', JSON.stringify(ideasTostorage));
}

function displayIdeasFromLocalStorage(){
let ideasTostorage = getIdeaFromLocalStorage();
ideasTostorage.forEach(idea => displayCard(idea.ideaUserName, idea.idea, idea.ideaTag));
}



function removeIdeasFromLocalStorage(id){
let ideasTostorage = getIdeaFromLocalStorage();
const update = ideasTostorage.filter(idea => idea.id !== id); 
localStorage.setItem('ideas', JSON.stringify(update));
}




//Alerts
function showError(message, className = 'error'){
const alertEl = document.createElement('div');
alertEl.classList.add('alert', className);
alertEl.appendChild(document.createTextNode(message));
alert.appendChild(alertEl);
setTimeout(() => {
    alertEl.remove();
}, 1200);
}

function showSuccess(message, className = 'success'){
const alertEl = document.createElement('div');
alertEl.classList.add('alert', className);
alertEl.appendChild(document.createTextNode(message));
alert.appendChild(alertEl);
setTimeout(() => {
alertEl.remove();
}, 1200);
}
 




//Check UI to remove the clearAll and 'My Ideas' when the list is empty
function checkUI(){
const card = cards.querySelectorAll('.card');
if(card.length === 0){
heading.textContent = 'ADD IDEAS';
clearBtn.style.display = 'none'

}else{
heading.textContent = 'MY IDEAS'
clearBtn.style.display = 'block'
}
}

//EventListener
addIdeaBtn.addEventListener('click', openModal);
window.addEventListener('click', outsideClick);
ideaForm.addEventListener('submit', submitIdea);
document.addEventListener('closeModal', close);
cards.addEventListener('click', removeIdeas)
clearBtn.addEventListener('click', clearAll);
document.addEventListener('DOMContentLoaded', displayIdeasFromLocalStorage)
checkUI();