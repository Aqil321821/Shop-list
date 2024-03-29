//   1. add items to list
/* firstly grab all the realted elements i.e form , input , and submit btn */
/* input field me jo likha or add pe click kia to list me wo item add ho jaye  */
/* form pe submit ka event tab run krta ha jab btn (type= submit ) pe click kia jaye */

const itemForm = document.getElementById('item-form');
const filter = document.getElementById('filter');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDom(item));
    checkUI();


}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // validate input field
    if (!newItem) {
        alert('Please Enter A list item');
        return;
        // ta k function yahi ruk jaye agr if chalta ha to
    }
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;

    } else {
        if (checkIfItemExists(newItem)) {
            alert("Item Already Exists !");
            return;

        }
    }

    // now create li and add to DOM
    addItemToDom(newItem);

    // now add it to local storage
    addItemToStorage(newItem);

    checkUI();

    // clear input field

    itemInput.value = '';
}


// when page loads display items from localStorage
function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];

    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
        // console.log(typeof itemsFromStorage);
        // here JSON.parse() making it array bcz originally values stored in LS was array that stringfy to JSON string


    }



    return itemsFromStorage;

}



function addItemToStorage(item) {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];

    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
        // console.log(typeof itemsFromStorage);
        // here JSON.parse() making it array bcz originally values stored in LS was array that stringfy to JSON string


    }

    itemsFromStorage.push(item);

    //  now convert this array back to json string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));


}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

// now create icon function then append icon inside of button
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    // ab yahan hamko ek button or icon bhi chaye jo k li k andar ho uske preferably create another functions
    //  we can do it right inside of li here but we don't
    // it will take same classes as args as our default html is
    // then we'll create icon function in which we append that i tag inside created button
    // we will call it here bcz we want to craete here item fully

    const button = createButton('remove-item btn-link text-red');
    // console.log(button);
    // now put inside to list item that created  button
    li.appendChild(button);
    // console.log(li);

    // now put whole created list item to our ul
    itemList.appendChild(li);
}

// Remove item function 
function removeItem(item) {
    // console.log(e); 
    // is me jab bhi ham ul k andar click kren gy to ul ouput hoga , agr li pe to li output hoga 
    //or agr icon pe to <i> console me milyga
    //we need to target that specif button "X" ,not anywhere else,so click on icon ,we will grab the parent of <i> i.e  btn
    //our btn has class of 'remove-item' so we check that our target element has class of "remove-item"
    //if so, we will remove that li
    // console.log(e.target);
    // we click on "X" then travers dom to delete li
    // if ki condition ye bta rahi ha k click hoa ha wo "X" pe hoa ha or kahi hota click to condition woud be false

    if (confirm('Are You Sure To Remove Item?')) {
        // remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);



        checkUI();
    }




}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage(); //array of values from storage 

    // args of this function is textContent of li which stored on localStorage
    // only remove that element which is being deleted from DOM not whole localStorage
    // filter out items 
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item); // this gives us array without the deleted item from storage

    // yahan filter method array me sirf wo items place krega jo k 'text.Content' k barbar nahi ha


    // now re-set localStorage 
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));


}


// on click li item gets editable
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {

        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }


}
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);

}




// pehle all li pe "edit-mode" ki class ko remove krega 
// phr jis  li pe click hoa ha usi pe "edit-mode" ki class dega

function setItemToEdit(item) {
    isEditMode = true;




    itemList.querySelectorAll('li').forEach(i => {
        i.classList.remove('edit-mode');

    });



    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"> </i>  Update Item';
    formBtn.style.backgroundColor = 'green';
    itemInput.value = item.textContent;



}


// remove all items function
function removeAll() {



    // isEditMode = false;
    // console.log('oooo');

    // itemList.innerHTML = '';

    // console.log(itemList.firstElementChild);
    while (itemList.firstElementChild) {
        itemList.removeChild(itemList.firstElementChild);
    }

    //   clear from localStorage
    localStorage.removeItem('items');
    // clear input
    if (itemInput.value) {
        itemInput.value = '';

    }


    checkUI();



}



function filterItems(e) {
    const text = e.target.value.toLowerCase();
    // now grab the list item's text and compare it with the input text
    const lists = itemList.querySelectorAll('li');
    lists.forEach((item) => {

        const listText = item.firstChild.textContent.toLowerCase();
        // li ka first child is a text node
        if (listText.indexOf(text) != -1) {
            item.style.display = 'flex';

        } else {
            item.style.display = 'none';

        }


        // console.log(item);
    });

    // console.log(text);

}

// remove btn and filter when no items in list
//we need to run this function at differnt stages or d/f conditions

/* 
1.on global scope 
2.when we add any li
3.when we remove any li
4.when we click on clear all
5.when page loads and items get display from local storage
*/
function checkUI() {
    itemInput.value = '';


    const lists = itemList.querySelectorAll('li');
    if (lists.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }


    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>  Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}






// initialize the app

function init() {

    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', removeAll);
    filter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);


    checkUI();

}



init();
