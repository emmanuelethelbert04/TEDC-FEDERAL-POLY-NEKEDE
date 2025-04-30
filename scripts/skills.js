const closeIcon = document.getElementById('js-close-icon')
const skilPopUp = document.getElementById('js-popup');
const addSkillForm = document.getElementById('add-skills-form');
const inpselectSkill = document.getElementById('skill-select');
const fullname = document.getElementById('fullname');
const department = document.getElementById('department');
const phoneNumber = document.getElementById('phone-number')
const inpDescription = document.getElementById('description-inp');
const inpselectIcon = document.getElementById('icon-select');

const skillList = document.getElementById('skills-list');


let selectedIcon = null

closeIcon.addEventListener('click', handleCloseSkill)

function handleCloseSkill() {
  skilPopUp.style.display = 'none'
}
