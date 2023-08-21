let updating = null; 

function ongetacall(event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let date = document.getElementById('date').value;
    let time = document.getElementById('time').value;

    // Storing Data
    let user = {
        name: name,
        email: email,
        phone: phone,
        date: date,
        time: time
    }
    
    let key = email; // Use the email as the key
    let userJSON = JSON.stringify(user);
    localStorage.setItem(key, userJSON);

    if (updating === null) {
        axios.post('https://crudcrud.com/api/b4783753368249aca5ed58fa076469fe/appointmentData', user)
            .then((response) => {
                showUserOnScreen(response.data);
            })
            .catch((error) => {
                console.error('Something Went Wrong', error);
            })
    } else {
        let url1 = 'https://crudcrud.com/api/b4783753368249aca5ed58fa076469fe/appointmentData/' + updating;
        axios.put(url1, user)
            .then((response) => {
                showUserOnScreen(response.data);
                location.reload();
            })
            .catch((error) => {
                console.error('Something Went Wrong', error);
            })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get('https://crudcrud.com/api/b4783753368249aca5ed58fa076469fe/appointmentData')
        .then(response => {
            for (let i = 0; i < response.data.length; i++) {
                showUserOnScreen(response.data[i]);
            }
        })
        .catch(err => {
            console.error(err);
        })
})

// Show User On Screen Function
function showUserOnScreen(user) {
    let parentElement = document.getElementById('listOfItems');
    let childElement = document.createElement('li');
    childElement.id = user._id;
    childElement.textContent = user.name + '-' + user.email + '-' + user.phone + '-' + user.date + '-' + user.time;

    // Delete Button
    var deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.style.backgroundColor = 'orange';
    deleteBtn.value = 'Delete';

    deleteBtn.onclick = () => {
        axios.delete(`https://crudcrud.com/api/b4783753368249aca5ed58fa076469fe/appointmentData/${user._id}`)
            .then(() => {
                removeUserFromScreen(user._id); 
            })
            .catch((err) => {
                console.error(err)
            })
    }

    // Edit Button
    var edit = document.createElement('input');
    edit.type = 'button';
    edit.style.backgroundColor = 'orange';
    edit.value = 'Edit';

    edit.onclick = () => {
        let editUser = JSON.parse(localStorage.getItem(user.email));
        document.getElementById('name').value = editUser.name;
        document.getElementById('email').value = editUser.email;
        document.getElementById('phone').value = editUser.phone;
        document.getElementById('time').value = editUser.time;
        document.getElementById('date').value = editUser.date;
        updating = user._id;

        localStorage.removeItem(user.email);
    }

    childElement.appendChild(edit);
    childElement.appendChild(deleteBtn);
    parentElement.appendChild(childElement);
}

// Remove User from Screen Function
function removeUserFromScreen(userId) {
    const parentNode = document.getElementById('listOfItems');
    const childNodeToBeDeleted = document.getElementById(userId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
    }
}
