let filterImgs = document.querySelectorAll('.js-filter-img');
let filterItems = document.querySelector('.js-filter-links');

const galleryPopUp = document.getElementById('js-gallery-popup');

const closeIcon = document.getElementById('js-close-gallery-icon');

const addGalleryForm = document.getElementById('upload-gallery-form');
const caterogries = document.getElementById('gallery-select');
const gellreyDescription = document.getElementById('description-gallery');
const uploadImgInput = document.getElementById('input-img');

// let selectedImg = null

function handleCloseSkill() {
  galleryPopUp.style.display = 'none';
}


window.addEventListener('load', () => {
  filterItems.addEventListener('click', (selectedItem) => {
    if(selectedItem.target.classList.contains('link')){
      document.querySelector('.activebtn').classList.remove('activebtn');
      selectedItem.target.classList.add('activebtn');
      let filterNames = selectedItem.target.getAttribute('data-name');
      filterImgs.forEach(img => {
        let filterImgs = img.getAttribute('data-name');

        if((filterImgs == filterNames) || filterNames == 'all'){
          img.style.display='block';
        }else{
          img.style.display= 'none';
        };
      });
    };
  });
});
closeIcon.addEventListener('click', handleCloseSkill);