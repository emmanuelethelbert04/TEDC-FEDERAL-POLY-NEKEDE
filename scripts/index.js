import { auth, database, storage } from './firebase.js';
import { ref, onValue, push, set} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import {ref as storageRef, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js"

window.onload = () => {
  const saveLoggedIn = sessionStorage.getItem('isLoggedIn');

  if(saveLoggedIn == true){
    console.log('logged In');
    window.location.href = 'index.html'
  }
}

const getStartedBtn = document.getElementById('js-get-started');

const signInBtn = document.getElementById('js-sign-in');
const mobileSignInBtn = document.getElementById('js-sign-in-mobile');
const signOutBtn = document.getElementById('js-sign-out');
const mobileSignOutBtn = document.getElementById('js-sign-out-mobile');

const popUp = document.getElementById('js-popped-up');
const galleryPopUp = document.getElementById('js-gallery-popup');

const skillRef = ref(database, 'skills');
const addSkillBtn = document.getElementById('js-add-skill');
const skilPopUp = document.getElementById('js-popup');
const addSkillForm = document.getElementById('add-skills-form');
const skillList = document.getElementById('skills-list');

const uploadGalleryForm = document.getElementById('upload-gallery-form');

const uploadGalleryBtn = document.getElementById('js-upload-gallery');

document.addEventListener('DOMContentLoaded', ()=> {

  const userId = localStorage.getItem("userId");

  if(getStartedBtn){
    getStartedBtn.addEventListener('click', () => {
      window.location.href = 'sign-up.html';
    });
  }

  if(signInBtn){
    signInBtn.addEventListener('click', () => {
      window.location.href = 'sign-in.html'
    });
  };

  if(mobileSignInBtn){
    mobileSignInBtn.addEventListener('click', () => {
      window.location.href = 'sign-in.html'
    });
  };

  updateUI(auth.curentUser);


  const user = userId;  
  console.log('User signed in: ', user);
  if(user){
    const userRef = ref(database, 'users/' + user);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();  
      if (data) {
        console.log(document.getElementById('js-user-dispaly-fullname').textContent = data.fullname);
        document.getElementById('js-user-email').textContent = data.email; 
      }else {  
        console.log('No user data found.');   
        // window.location.href = "sign-in.html";  
      } 
    })
  } else {  
    console.log('No user is signed in.');   
    // window.location.href = "sign-in.html";   
  } ;
});

auth.onAuthStateChanged((user) => {
  updateUI(user);
})

export default function updateUI(user){
  if(signInBtn){
    if(user){
      signInBtn.style.display = 'none';
      mobileSignInBtn.style.display = 'none';
      mobileSignOutBtn.style.display = 'none'
      popUp.style.display = 'block';
      if(window.innerWidth <= 768){
        popUp.style.display = 'none';
        mobileSignOutBtn.style.display = 'flex'
      }
      signOutBtn.onclick = ()=> signOutUser();
      mobileSignOutBtn.onclick = ()=> signOutUser();
    }else{
      signInBtn.textContent = 'Sign in';
      mobileSignOutBtn.style.display = 'none'
      signInBtn.onlick = () => signInUser();
    }
  }

  if(getStartedBtn){
    if(user){
      getStartedBtn.textContent = 'Explore Our Program';
      getStartedBtn.onclick = () => redirectToUserSkill(user.user);
    }else{
      getStartedBtn.onclick = () => {
        window.location.href = 'sign-up.html'
      }
    }
  }
  if(addSkillBtn){
    if(user){
      addSkillBtn.onclick = () => handleAddSkill();
      addSkillForm.addEventListener('submit', handleSaveSkills)
    }else{
      addSkillBtn.onclick = () => {
        alert("Sign In to add a skill");
        window.location.href = 'sign-in.html';
      }
    }
  }

  if(uploadGalleryBtn){
    if(user){
      uploadGalleryBtn.onclick = () => handleUploadGallery();
      uploadGalleryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSaveGallery();
      })
    }else{
      uploadGalleryBtn.onclick = () => {
        alert("Sign In to upload to gallery");
        window.location.href = 'sign-in.html'
      }

    }
  }
}

// sign in function
function signInUser(){
  window.location.href = 'sign-in.html';
}

// sign out funciton 
function signOutUser(){
  auth.signOut().then(() => {
    sessionStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId')
    updateUI(null);
    window.location.href = 'index.html'
  }) .catch(() => {
    console.error('Error signing Out:', error.message);
  })
}

function redirectToUserSkill(userId) {
  window.location.href = 'services.html'
}

function handleAddSkill() {
  skilPopUp.style.display = 'flex';
}

function handleUploadGallery() {
  galleryPopUp.style.display = 'flex';
}

function handleSaveSkills(e) {
  e.preventDefault();
  const skill = inpselectSkill.value.trim();
  const fullNameVal = fullname.value.trim();
  const departmentVal = department.value.trim();
  const phoneNumberVal = phoneNumber.value.trim();
  const description = inpDescription.value.trim();
  const icon = inpselectIcon.value.trim();
  // console.log(skill)
  // console.log(description)
  // console.log(icon)

  if(!skill || !fullNameVal || !departmentVal || !phoneNumberVal || !description || !icon){
    alert('Please fill all the fields');  
    return
  }

  const skillRef = ref(database, `skills`);
  const newSkillRef = push(skillRef)
  set(newSkillRef, {
    skill,
    fullNameVal,
    departmentVal,
    phoneNumberVal,
    description,
    icon
  })
  .then(() => {
    console.log('skill added successfully');
    addSkillForm.reset();
    skilPopUp.style.display = 'none';
  })
  .catch(error => {
    console.log('Error saving skill' + error.message)
  })
  // alert('clicked')
}

function renderSkills(){
  onValue(skillRef, (snapshot) =>{
    skillList.innerHTML = '';
    const skills = snapshot.val();

    if(skills){
      Object.keys(skills).forEach((id) => {
        const {skill, fullNameVal, departmentVal, phoneNumberVal, description, icon} = skills[id];
        const skillDiv = document.createElement('div');
        skillDiv.innerHTML = `
          <div class="card1">
            <div class="icon-div">
               <i class="${icon}"></i></h3> 
            </div>
            <h3>${skill}</h3>
            <p style="font-weight: bold;">By ${fullNameVal} - ${phoneNumberVal} - ${departmentVal}</p>
            <p>${description}</p>
          </div>
        `;
        skillList.appendChild(skillDiv);
      });
    }else{
      skillList.innerHTML = '<p>No Skill Added Yet </p>'
    }
  });
};

renderSkills();

// async function handleSaveGallery() {
//   const categories = caterogries.value.trim();
//   const description = gellreyDescription.value.trim();
//   const image = uploadImgInput.files[0];
//   // console.log(skill)
//   // console.log(description)
//   // console.log(icon)

//   if(!categories || !description || !image){
//     alert('Please fill all the fields');  
//     return;
//   }

//   try{
//     const imgRef = storageRef(database, `images/${image.name}`);
//     await uploadBytes(imgRef, image);

//     const url = await getDownloadURL(imgRef);

//     const galleryRef = databaseRef(database, 'galleries/');
//     const newGalleryRef = push(galleryRef);  
//     await set(newGalleryRef, {  
//       image: image.name,  
//       url: url,  
//       category: category,  
//       description: description,  
//       timestamp: Date.now()  
//     }); 
//     uploadGalleryForm.reset();  
//   } catch (error) {  
//     console.error(error);  
//   } 
// }

