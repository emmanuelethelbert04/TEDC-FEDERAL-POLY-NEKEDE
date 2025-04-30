import { auth, database } from './firebase.js'; 
import { ref, set, onValue, push, get, update, remove  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


async function addSkill() {
  const addSkillForm = document.getElementById('add-user-form')
  const skill = document.getElementById('skill-select').value.trim();
  const fullNameVal = document.getElementById('fullName').value.trim();
  const departmentVal = document.getElementById('departMent').value.trim();
  const phoneNumberVal = document.getElementById('number').value.trim();
  const description = document.getElementById('description-inp').value.trim();
  const icon = document.querySelector('#icon-select-skill').value.trim();  

  if(!skill || !fullNameVal || !departmentVal || !phoneNumberVal || !description || !icon){
    alert('Please fill all the fields');  
    return
  }

  const skillRef = ref(database, `skills`)
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
  });
};

function fetchAndDisplaySkills(){
  const userListElement = document.getElementById('user-list');  
  
  const skillsRef = ref(database, 'skills/');
  
  onValue(skillsRef, (snapshot) => { 
    userListElement.innerHTML = ''; 
    const skills = snapshot.val(); 
    if (skills) {  
      // let userCounter = 1; 
      Object.keys(skills).forEach(key => {  
        const {skill, fullNameVal, departmentVal, phoneNumberVal, icon, description} = skills[key]; 

        // Create a new table row  
        const row = document.createElement('tr');
        row.dataset.userId = key; // Store user ID
        row.innerHTML=`
          <td>
            <div class="user-id">
              <i class="${icon}" style="color: rgba(196,138,0,1);"></i>
            </div>
          </td>

            <td class="created">
            <p>${skill}</p>
            <P style="display: none">${fullNameVal} - ${departmentVal} - ${phoneNumberVal}</p>
          </td>

          <td class="description">
            <p>
              ${description}
            </p>
          </td>
        `;

        row.addEventListener('click', (e) => {
          e.stopPropagation()
          const userId = row.dataset.userId;
          localStorage.setItem('userId', userId)
          openEditUserForm(userId)
        });
        // Append the new row to the user list  
        userListElement.appendChild(row);
      })
    }else {  
      // Handle case where no users exist  
      userListElement.innerHTML = '<tr><td colspan="3">No skills  found.</td></tr>';  
    }
  })
}

async function openEditUserForm(userId) {
  try{
    const userSnapshot = await get(ref(database, `skills/${userId}`));
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      document.getElementById('js-user-description').value = userData.description;

      document.getElementById('fullname').value = userData.fullNameVal;

      document.getElementById('department').value = userData.
      departmentVal;

      document.getElementById('phone-number').value = userData.phoneNumberVal;

      document.getElementById('js-user-title').value = userData.skill;

      document.getElementById('icon-select').value = userData.icon;

      document.getElementById('update-skill-overlay').style.display = 'flex';

      document.getElementById('update-skill-overlay').style.opacity = '1';

      document.getElementById('update-skill-overlay').dataset.userId = userId;

    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

async  function updateUser(e){
  e.preventDefault()

  const overlay = document.getElementById('update-skill-overlay');

  const userId = overlay.dataset.userId;

  console.log(userId)

  const newSkillTitle = document.getElementById('js-user-title').value;

  const newDescription = document.getElementById('js-user-description').value;

  const newIcon = document.getElementById('icon-select').value;


  try{
    const skillRef = ref(database, `skills/${userId}/`);

    await update(skillRef, { skill: newSkillTitle });
    
    await update(skillRef, { description: newDescription });

    await update(skillRef, { icon: newIcon });

    console.log('User balance updated successfully');

    document.getElementById('update-skill-form').reset();
    document.getElementById('update-skill-overlay').style.display = 'none';
    document.getElementById('update-skill-overlay').style.opacity = '0';
    delete document.getElementById('update-skill-overlay').dataset.userId; // Clean up
  }catch (error) {
    console.error('Error updating user balance:', error);
  }
}

async function deleteUser(userId){
  try{
    const skillRef = ref(database, `skills/${userId}`); 
    await remove(skillRef)
    .then(() =>{
      console.log('User skills deleted successfully');  
    }).catch((error) => {
      console.error("Error deleting user skills: ", error);
    }) 
    document.getElementById('delete-user-overlay').style.display = "none"
    document.getElementById('delete-user-overlay').style.opacity = '0'
  } catch (error) {  
    console.error('Error deleting user:', error);  
  } 
}

function adminSignOut(){
  auth.signOut().then(() => {
    const admin = auth.currentUser;

    window.location.href = 'sign-in.html';  
    set(ref(database, `admins/${admin.uid}`), false);
    sessionStorage.getItem('isAdminLoggedIn', 'false');  
  }).catch((error) => {
    console.error('Error signing out:', error.message);  

  })
}


document.addEventListener('DOMContentLoaded', () => {  
  const addUserButton = document.querySelector('.add-btn');  
  // const addTransactionButton = document.querySelector('.transaction-btn');  
  
  // display Add user form
  const displayAddUserForm = document.getElementById('add-user-overlay');
  addUserButton.addEventListener('click', () => {  
    displayAddUserForm.style.opacity = '1';
    displayAddUserForm.style.display = 'flex';

  }); 

  // Cancel icons 
  const cancelIcon = document.getElementById('js-cancle-btn');
  cancelIcon.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
    displayAddUserForm.style.display = 'none';
  });

  const updateCancelIcon  = document.getElementById('js-cancle-update-btn')

  const updateUserForm = document.getElementById('update-skill-overlay');

  updateCancelIcon.addEventListener('click', () => {
    updateUserForm.style.opacity = '0';
    updateUserForm.style.display = 'none';
  })


  // cancel buttons 
  const cancelBtn = document.getElementById('cancel-btn');
  cancelBtn.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
  });

  // Add users form admin
  const userForm = document.querySelector('#add-user-form');
  
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addSkill();
    document.getElementById('add-user-form').reset(); 
    
    document.getElementById('add-user-overlay').style.display = 'none'; 
  });

  fetchAndDisplaySkills()  

  updateUserForm.addEventListener('submit', updateUser)

  // delete pop up 
  document.getElementById('delete-btn').addEventListener('click', () => {
    updateUserForm.style.opacity = '1';
    updateUserForm.style.display = 'flex';
    document.getElementById('delete-user-overlay').style.display = "flex"
    document.getElementById('delete-user-overlay').style.opacity = '1'
  })
  

  // delete user 
  document.getElementById('js-delete-user').addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    deleteUser(userId)
  })

  // cancel for deleting user 
  document.querySelector('#delete-user-cancel-btn').addEventListener('click', () => {
    document.getElementById('delete-user-overlay').style.display = "none"
    document.getElementById('delete-user-overlay').style.opacity = '0'  
  })

  // const mobileUserView = document.getElementById('mobile-users-view');
  // const mobileTransactionView = document.getElementById('mobile-tranc-view')
  // mobileUserView.classList.add('active')
  // mobileUserView.addEventListener('click', () => {
  //   mobileUserView.classList.add('active');
  //   mobileTransactionView.classList.remove('active')
  //   document.querySelector('.transaction-container').style.display = 'none';
  //   document.querySelector('.users-container').style.display = 'flex';
  // })
  // mobileTransactionView.addEventListener('click', () => {
  //   mobileTransactionView.classList.add('active')
  //   mobileUserView.classList.remove('active')
  //   document.querySelector('.users-container').style.display = 'none';
  //   document.querySelector('.transaction-container').style.display = 'flex';
  // })


  // sign out 
  const signOutBtn = document.getElementById('admin-sign-out');
  
  signOutBtn.addEventListener('click', adminSignOut)
});  