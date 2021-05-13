const baseURL = 'http://localhost:8081';
let doctors;

const initResetButton = () => {
    fetch(`${baseURL}/reset/`)
        .then(response => response.json())
        .then(data => {
            console.log('reset:', data);
        })
        .then(getDoctors)
        .then(()=>{
            alert('You have reset the data!');
        });
};

const getDoctors = (callback,newDocID) => {
    console.log(newDocID);
    fetch(`${baseURL}/doctors`)
    .then(response => response.json())
    .then(data => {
        console.log("getDoctors called");
        doctors = data;
        const listItems = data.map(item => `<li>
        <a href="#" data-id="${item._id}">${item.name}</a>
    </li>`);
        document.querySelector('#allDoctors').innerHTML = `
        <ul>
        ${listItems.join('')}
    </ul>`
        document.querySelector("#doctor").innerHTML = "Selected doctor goes here.";
        document.querySelector("#companions").innerHTML = "Selected doctor's companions go here.";
    })
    .then(resp => {
        attachEventHandlers();
        if (callback) {
            console.log("getDoctors callback");
            callback(newDocID);
        }
    });
    
};

const attachEventHandlers = () => {
    document.querySelectorAll('#allDoctors a').forEach(a => {
        a.onclick = getDoctor;
    });
    document.querySelector('#add').onclick = newDoctor;
};

const getDoctor = ev => {
    var id = ev.currentTarget.dataset.id;
    var doc = doctors.filter(doctor => doctor._id === id)[0];
    console.log(doc);
    document.querySelector('#doctor').innerHTML = "";
    document.querySelector('#doctor').innerHTML = `
        <h2>${doc.name}</h2>
        <button class="btn" id="edit" onclick = "editDoctor('${doc._id}')">Edit</button>
        <button class="btn" id="delete" onclick = "deleteDoctor('${doc._id}')">Delete</button>
        <p>Seasons: ${doc.seasons}</p>
        <img src="${doc.image_url}" />`;
    getCompanions(id);
}

const getDoctorNoEv = (id_) => {
    console.log('step 2');
    var doc = doctors.filter((doctor) => doctor._id == id_)[0];
    console.log('getDoctorNoEv found', doc);
    document.querySelector('#doctor').innerHTML = "";
    document.querySelector('#doctor').innerHTML = `
        <h2>${doc.name}</h2>
        <button class="btn" id="edit" onclick = "editDoctor('${doc._id}')">Edit</button>
        <button class="btn" id="delete" onclick = "deleteDoctor('${doc._id}')">Delete</button>
        <p>Seasons: ${doc.seasons}</p>
        <img src="${doc.image_url}" />`;
    getCompanions(doctors[doctors.length-1]._id);
};

const getCompanions = id => {
    fetch(`${baseURL}/doctors/${id}/companions`)
    .then(response => response.json())
    .then(data => {
        const listItems = data.map(item => `<li>
        <img src="${item.image_url}" />
        <a href="#" data-id="${item._id}">${item.name}</a>
    </li>`);
        document.querySelector('#companions').innerHTML = `
        <h2>Companions</h2>
        <ul>
        ${listItems.join('')}
    </ul>`
    });
};

const newDoctor = () => {
    document.querySelector('#doctor').innerHTML = "";
    document.querySelector('#doctor').innerHTML = `
    <form>
        <section class="formClass1">
            <label for="name">Name:</label>
            <input type="text" id="name" style = "width:280px;">
        </section>
        <section class="formClass2">
            <label for="seasons">Seasons:</label>
            <input type="text" id="seasons" style = "width:280px;">
        </section>
        <section class="formClass3">
            <label for="ordering">Ordering:</label>
            <input type="text" id="ordering" value = "14" style = "width:280px;">
        </section>
        <section class="formClass4">
            <label for="image_url">Image URL:</label>
            <input type="text" id="image_url" style = "width:280px;">
        </section>
        <button class="btn btn-main" id="create" type="button" onclick = "saveDoctor()">Save</button>
        <button class="btn" id="cancel" type="button" onclick = "getDoctors()">Cancel</button>
    </form>`
    document.querySelector('#companions').innerHTML = ""
}

const editDoctor = id_ => {
    console.log('is the problem here?');
    var doc = doctors.filter((doctor) => doctor._id == id_)[0];
    document.querySelector('#doctor').innerHTML = "";
    document.querySelector('#doctor').innerHTML = `
    <form>
        <section class="formClass1">
            <label for="name">Name:</label>
            <input type="text" id="name" value = "${doc.name}" style = "width:280px;">
        </section>
        <section class="formClass2">
            <label for="seasons">Seasons:</label>
            <input type="text" id="seasons" value = "${doc.seasons}" style = "width:280px;">
        </section>
        <section class="formClass3">
            <label for="ordering">Ordering:</label>
            <input type="text" id="ordering" value = "${doc.ordering}" style = "width:280px;">
        </section>
        <section class="formClass4">
            <label for="image_url">Image URL:</label>
            <input type="text" id="image_url" value = "${doc.image_url}" style = "width:280px;">
        </section>
        <button class="btn btn-main" id="create" type="button" onclick = "sendEditedDoctor('${id_}')">Save</button>
        <button class="btn" id="cancel" type="button" onclick = "getDoctorNoEv('${id_}')">Cancel</button>
    </form>`
    document.querySelector('#companions').innerHTML = ""
}

const saveDoctor = ev => {
    const data = {
        name: document.getElementById("name").value,
        seasons: document.getElementById("seasons").value.split(','),
        ordering: document.getElementById("ordering").value,
        image_url: document.getElementById("image_url").value
    }
    if (data.name == "") {
        console.error('Missing name!');
        alert('Missing name!');
        return;
    }
    if (data.seasons == "") {
        console.error('Missing seasons!');
        alert('Missing seasons!');
        return;
    }
    else if (data.seasons.some(isNaN)) {
        console.error('Seasons should be numbers seperated by commas!');
        alert('Seasons should be numbers seperated by commas!');
        return;
    }
    fetch('/doctors', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        } else {
            return response.json();
        }
    })
    .then(resp => {
        console.log('Success:', resp);
        return resp;
    })
    // .then(resp => {
    //     // console.log(resp);
    //     // console.log(doctors);
    //     // doctors.push(resp);
    //     return ;
    // })
    .then(resp => {
        getDoctors(getDoctorNoEv,resp._id);
    })
    .catch(err => {
        console.error(err);
    });
};

const deleteDoctor = (ID) => {
    console.log(ID);
    check = confirm("Are you sure you want to delete this doctor?");
    console.log(check);
    if (check) {
        const url = `/doctors/${ID}`;
        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                return response.text();
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .then(getDoctors)
        .catch(err => {
            console.error(err);
            alert('Error!');
        });
      }
    else {
        return;
    }
};

const sendEditedDoctor = id_ => {
    const url = `/doctors/${id_}`;
    const data = {
        name: document.getElementById("name").value,
        seasons: document.getElementById("seasons").value.split(','),
        ordering: document.getElementById("ordering").value,
        image_url: document.getElementById("image_url").value
    }
    if (data.name == "") {
        console.error('Missing name!');
        alert('Missing name!');
        return;
    }
    if (data.seasons == "") {
        console.error('Missing seasons!');
        alert('Missing seasons!');
        return;
    }
    else if (data.seasons.some(isNaN)) {
        console.error('Seasons should be numbers seperated by commas!');
        alert('Seasons should be numbers seperated by commas!');
        return;
    }
    fetch(url, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log('Success:', data);
            return data
        })
        .then(resp => {
            getDoctors(getDoctorNoEv,resp._id);
        })
        .catch(err => {
            console.error(err);
            alert('Error!');
        });
}
// invoke this function when the page loads:
getDoctors();