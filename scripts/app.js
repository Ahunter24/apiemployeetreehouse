(function () {

    //Fetch profiles data from the api
    const fetchData = (url) => {
        let data = fetch(url)
            .then(checkDataStatus)
            .then(data => data.json())
            .then(data => data.results);

        return data;
    };

    //The status of the response
    const checkDataStatus = (response) => {
        if(response.ok){
            return Promise.resolve(response);
        } else{
            return Promise.reject(new Error(response.status));
        }
    };

    //Data from the employees
    let data = fetchData('https://randomuser.me/api/?results=12&nat=ES')
        .catch(err => console.log('Oops there was a problem ' + err));

    //Creates the employee cards
    const setPersonData = () => {

        data.then(people => {
            people.forEach(person => {

                let card = $(
                    '<div class="card">' +
                    '<div class="card-img-container">' +
                    `<img class="card-img" src="${person.picture.large}" alt="profile picture">` +
                    '</div>' +
                    '<div class="card-info-container">' +
                    `<h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>` +
                    `<p class="card-text">${person.email}</p>` +
                    `<p class="card-text cap">${person.location.city}</p>` +
                    '</div>'
                );

                $('#gallery').append(card);

            });

            addCardsEventListener();

        })

    };

    //Add event listeners for all the cards
    const addCardsEventListener = () => {
        const cards = Array.from(document.getElementsByClassName('card'));
        cards.forEach(card => {
            card.addEventListener('click', function () {
                setModalData(this);
            });
        })
    };

    //Add event listener on the modal close icon
    const addModalEventListener = () => {
        $('.modal-close-btn').click(function () {
            this.parentNode.parentNode.remove();
        })
    }

    //Capitalize every words first letter
    const capitalizeString = str => str.replace(/\b\w/g, l => l.toUpperCase());

    //Construct modal html
    const constructModal = (details, extendedDetails) => {

        let personDetails = $(

            '<div class="modal-container">' +
            '<div class="modal">' +
            '<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>' +
            `<div id="${extendedDetails.id}" class="modal-info-container">` +
            `<img class="modal-img" src="${details.image}" alt="profile picture">` +
            `<h3 id="name" class="modal-name cap">${details.name}</h3>` +
            `<p class="modal-text">${details.email}</p>` +
            `<p class="modal-text cap">${details.location}</p>` +
            '<hr>' +
            `<p class="modal-text">${extendedDetails.cell}</p>` +
            `<p class="modal-text">${extendedDetails.street} ${extendedDetails.state}, ${extendedDetails.postcode}</p>` +
            `<p class="modal-text">Birthday: ${extendedDetails.date}/${extendedDetails.month}/${extendedDetails.year}</p>` +
            '</div>' +
            '<div class="modal-btn-container">' +
            '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>'+
            '<button type="button" id="modal-next" class="modal-next btn">Next</button>'+
            '</div>'+
            '</div>'+
            '</div>'

        );

        return personDetails;
    }

    //Set modal data
    const setModalData = (person) => {

        //Get selected card details
        let image = $(person).find('img').attr('src');
        let name = $(person).find('h3').text();
        let email = $(person).find('h3').next().text();
        let location = $(person).find('h3').next().next().text();

        let details = {image, name, email, location};

        let extendedDetails;

        //Get more user details
        data.then(people => {

            people.forEach((pers, index) => {

                if(details.email === pers.email){

                    let cell = pers.cell;
                    let address = pers.location;
                    let street = capitalizeString(address.street);
                    let state = capitalizeString(address.state);
                    let postcode = capitalizeString(address.postcode.toString());
                    let dateOfBirth = pers.dob.date;
                    let dateObj = new Date(dateOfBirth);
                    let date = dateObj.getDate();
                    let month = dateObj.getMonth();
                    let year = dateObj.getFullYear();
                    let id = index;

                    extendedDetails = {cell, street, state, postcode, date, month, year, id};

                }

            })

            //Append modal to gallery
            let modal = constructModal(details, extendedDetails);
            $(modal).insertAfter($('#gallery'));

            //Add event listener for closing the modal
            addModalEventListener();

        })

    }

    //Put all names in an array
    const getNames = () => {
        let names = Array.from(document.getElementsByClassName('card-name'));
        return names;
    }

    //Put all cards in an array
    const gerCards = () => {
        let cards = Array.from(document.getElementsByClassName('card'));
        return cards;
    }

    //Append search markup to the document
    const addsearchMarkup = () => {
        const searchMarkup =
            `<form action="#" method="get">
                  <input type="search" id="search-input" class="search-input" placeholder="Search...">
                  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
            </form>`;

        $('.search-container').append(searchMarkup);

    }

    //Search for a user
    const search = () => {

        $('#serach-submit').click(function (e) {

            e.preventDefault();

            let names = getNames();
            let cards = gerCards();

            names.forEach(name => {

                let searchedName = $('#search-input').val();

                if(name.innerText.toLowerCase() === searchedName.toLowerCase()){

                    $(cards).hide();

                    cards.filter(card => {
                        if($(card).find('h3').text() === name.innerText){

                            $(card).show();
                            $('#search-input').val('');

                        }
                    })

                }
            })

        })
    }

    setPersonData();
    addsearchMarkup();
    search();

}());
