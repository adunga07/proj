class Order{
    constructor(_id, _fullName, _email, _description){

        if(arguments.length != 4)
        {
            throw new Error("Please, provide 4 properties")
        }

        this.id = _id;
        this.fullName = _fullName;
        this.email = _email;
        this.description = _description;
    }
}

var orders = [];

console.log('Orders (before request) = ', orders);

//Request orders data from the api endpoint
const token = localStorage.getItem('token'); // Replace 'yourTokenKey' with the actual key
const settings = {
    async: true,
    crossDomain: true,
    url: 'https://localhost:7084/api/Orders',
    method: 'GET',
    headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
};


//Update with error handling
$.ajax(settings).done(function (response) {
    console.log(response);
    orders = response;
    console.log('Orders (after request response) = ', orders);
    populateTable();
}).fail(function (jqXHR, textStatus, errorThrown) {
    console.log('Error = ', errorThrown);
    console.log('Text Status = ', textStatus);
    console.log('jqXHR = ', jqXHR);

    // Check for a 401 Unauthorized response
    if (jqXHR.status === 401) {
        alert('Unauthorized: Redirecting to login');
        window.location.href = 'login.html';
    } else {
        alert('Error occurred while fetching orders');
    }
});


//Get Table -> <tbody>
const ordersTableBody = $("#ordersTbl tbody");
ordersTableBody.empty();

function populateTable(){
    $.each(orders, function(index, order){

        console.log(`Index = ${index}. Order = ${order}`);

        const newRowHtml = `<tr>
            <td>${order.fullName}</td>
            <td>${order.email}</td>
            <td onclick="detectTextLanguage('${order.description}')">${order.description}</td>
            <td>
                <button id="editBtn" data-order-id="${order.id}">Edit</button>
                <button id="removeBtn" data-order-id="${order.id}">Remove</button>
            </td>
        </tr>`;

        ordersTableBody.append(newRowHtml);
    });
}



$(ordersTableBody).on('click', "#editBtn", function(){
    const orderId = $(this).data('order-id');
    const order = orders.find(n => n.id === orderId);

    localStorage.setItem('itemToBeEditedId', orderId);

    $("#fullName").val(order.fullName);
    $("#email").val(order.email);
    $("#description").val(order.description);

    $("#editModal").show();
})


$(ordersTableBody).on('click', "#removeBtn", function(){
    const orderId = $(this).data('order-id');
    const order = orders.find(n => n.id === orderId);
    // editOrder(order);

    localStorage.setItem('itemToBeRemovedId', orderId);


    console.log($`Selected order = ${order}`);

    $("#remove-fullname").text(order.fullName);

    $("#removeModal").show();
})

$("#closeEditModalSpn").click(function(){
    $("#editModal").hide();
});

$("#cancelRemoveBtn").click(function(){
    $("#removeModal").hide();
});

$("#confirmBtn").click(function(){

    //1. Get order id of the item to be removed
    var orderId = localStorage.getItem('itemToBeRemovedId');
    
    //parse orderid to int
    // var orderId = parseInt(orderIdStr);
    var url = 'https://localhost:7084/api/Orders/' + parseInt(orderId);

    var settings = {
        async: true,
        crossDomain: true,
        url: url,
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert('Order removed successfully');

    });



    $("#removeModal").hide();
    // location.reload();
    // alert('Order removed successfully');
})

function detectTextLanguage(textToBeDetected){

    console.log('textToBeDetected = ', textToBeDetected);

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': 'd67a5eab10msh444b6ea21047b91p12c928jsn78f03f342a27',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: {
            q: textToBeDetected
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);

        alert(response.data.detections[0][0].language)

    });
}