console.log('inside bamazonCustomer');

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

//Function to display products
var displayProducts = function(){
    //connection to mysql 
	var query = "Select * FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;
		//Create CLI-Table
		var displayTable = new Table ({

			head: ["Item ID", "Product Name", "Category", "Price", "Quantity"],
            //row widths
			colWidths: [10, 25, 25, 10, 14]
		});
        //push data to table
		for (var i = 0; i < res.length; i++){
			displayTable.push(
			[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
			}
			
			console.log(displayTable.toString());
			purchasePrompt();

	})

}


function purchasePrompt() {
    //get item id and amount from user
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the number of the item you wish to buy?"
        }, {
            name: "Quantity",
            type: "input",
            message: "How many would you like to buy?"
        },

    ]).then(function(answers) {
        var quantityNeeded = answers.Quantity;
        var IDrequested = answers.ID;
        purchaseOrder(IDrequested, quantityNeeded);
    });

}; 


function purchaseOrder(ID, amtNeeded) {
    // MySQL connection query to products
    connection.query('SELECT * FROM products WHERE item_id = ' + ID, function(err, res) {
        if (err) { console.log(err) };
        //if item is in stock
        if (amtNeeded <= res[0].stock_quantity) {
            //calculate the cost cost
            var totalCost = res[0].price * amtNeeded;
            console.log("Good news you're order is in stock!");
            console.log("Your total cost for " + amtNeeded + " " + res[0].product_name + " is " + totalCost + ". Thank you!");
            
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + " WHERE item_id = " + ID);
        } else {
            console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + " to complete your order.");
        };
        displayProducts();
    });

};

displayProducts();










