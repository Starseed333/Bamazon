console.log('inside bamazonManager');


//NPM Packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//connection object
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if(err)throw err;
    console.log("connected as id" + connection.threadId);
    
});


function displayInventory() {
    //display inventory to Manager
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) { console.log(err) };
        //Create CLI-table
        var theDisplayTable = new Table({
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            //row widths
            colWidths: [10, 25, 25, 10, 14]
        });
    
        for (i = 0; i < res.length; i++) {
            //push data to table
            theDisplayTable.push(
            [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        
        console.log(theDisplayTable.toString());
        inquireForUpdates();
    });
}; 



function inquireForUpdates() {
    //inquire for input
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below to manage current inventory:",
        choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product"]
    }]).then(function(answers) {
        //select manager response
        switch (answers.action) {

            case 'Restock Inventory':
                restockRequest();
                break;

            case 'Add New Product':
                addRequest();
                break;

            case 'Remove An Existing Product':
                removeRequest();
                break;

        }
    });
}; 


function restockRequest() {
    //prompt Manager for the restock items
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item number of the item you would like to restock?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "What is the quantity you would like to add?"
        },

    ]).then(function(answers) {
        var quantityAdded = answers.Quantity;
        var IDOfProduct = answers.ID;
        restockInventory(IDOfProduct, quantityAdded);
    });
}; 





function restockInventory(id, quant) {
    //starts connection to mysql database to restock the inventory
    connection.query('SELECT * FROM Products WHERE item_id = ' + id, function(err, res) {
        if (err) {console.log(err) };
        connection.query('UPDATE Products SET stock_quantity = stock_quantity + ' + quant + ' WHERE item_id = ' + id);
       
        displayInventory();
    });
}; 


function addRequest() {
    inquirer.prompt([

        {
            name: "Name",
            type: "input",
            message: "What is the name of the product you would like to stock?"
        },
        {
            name: 'Category',
            type: 'input',
            message: "What is the category for this product?"
        },
        {
            name: 'Price',
            type: 'input',
            message: "What is the price of this item?"
        },
        {
            name: 'Quantity',
            type: 'input',
            message: "What is the quantity you would like to add?"
        },

    ]).then(function(answers){
        var name = answers.Name;
        var category = answers.Category;
        var price = answers.Price;
        var quantity = answers.Quantity;
        buildNewItem(name,category,price,quantity);
    });
}; 



function buildNewItem(name,category,price,quantity){
    //start connection to mysql database to add new item
    connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES("' + name + '","' + category + '",' + price + ',' + quantity +  ')');
    displayInventory();

};


function removeRequest(){
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item number of the item you would like to remove?"
        }]).then(function(answer){
            var id = answer.ID;
            removeInventory(id);
        });
};


function removeInventory(id){
    //start connection to mysql database to remove item
    connection.query('DELETE FROM Products WHERE item_id = ' + id);
    displayInventory();
};

displayInventory();
