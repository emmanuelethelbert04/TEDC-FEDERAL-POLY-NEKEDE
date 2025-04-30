import { auth } from './firebase.js';

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  

document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('js-forget-password-form');
  const email = document.getElementById('email-input')
  const resetBtn = document.getElementById('forget-password-btn')
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(email.value)
    resetBtn.textContent = 'Please wait...'
    resetPasswordResetEmail(email.value)
  })
})

function resetPasswordResetEmail(email){
  const emailForm = document.getElementById('js-forget-password-form');
  const resetBtn = document.getElementById('forget-password-btn')


  sendPasswordResetEmail(auth, email).then(() => {
    console.log('Password reset email to', email);
    alert('Password reset email sent! Check your Inbox.');
    emailForm.reset();
    resetBtn.textContent = 'Sent!'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log('Error: ', errorCode, errorMessage);
    alert('Error' + error.message);
  })
}
