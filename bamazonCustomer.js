var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Vint@ge0916!",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(
      "------------------------\nItems Available for Sale\n------------------------"
    );
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].id +
          " | " +
          res[i].productName +
          " | " +
          res[i].departmentName +
          " | Price: $" +
          res[i].price +
          " | Quantity: " +
          res[i].stockQuantity
      );
    }
    console.log("---------------------------------------------------------");
    // query the database for all items being selected
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to stockQuantity on
      inquirer
        .prompt([
          {
            name: "product",
            type: "list",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(
                  res[i].id.toString() + " " + res[i].productName
                );
              }
              return choiceArray;
            },
            message: "What product would you like to select?"
          }
        ])
        .then(function(answer) {
          // when finished prompting, insert a new item into the db with that info
          var splitItemID = answer.product.split(" ", 1);
          var chosenQuantity = parseInt(splitItemID - 1);
          inquirer
            .prompt([
              {
                name: "quantityPurchased",
                type: "input",
                message: "What quantity would you like to purchase?",
                //Determining if the input is valid
                validate: function(value) {
                  if (parseInt(value) < 0) {
                    console.log("\nPlease enter a non-negative value");
                    return false;
                  }
                  if (
                    isNaN(value) === false &&
                    res[chosenQuantity].stockQuantity >= parseInt(value)
                  ) {
                    return true;
                  }
                  console.log(
                    "\nQuantity specified not in supply. Please specify a different amount."
                  );
                  return false;
                }
              }
            ])
            .then(function(ans) {
              //Updates MySQL database
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stockQuantity:
                      res[chosenQuantity].stockQuantity - ans.quantityPurchased
                  },
                  {
                    id: chosenQuantity + 1
                  }
                ],
                function(err, res) {
                  if (err) throw err;
                }
              );
              console.log(
                "\nCongratulations. You have purchased " +
                  ans.quantityPurchased +
                  " " +
                  res[chosenQuantity].productName +
                  "(s) @ $" +
                  res[chosenQuantity].price +
                  " for a grand total of: $" +
                  res[chosenQuantity].price * ans.quantityPurchased +
                  "!\n"
              );

              restartPrompt();
            });

          function restartPrompt() {
            inquirer
              .prompt([
                {
                  name: "restart",
                  type: "list",
                  message: "Would you like to make another purchase?",
                  choices: ["Yes", "No"]
                }
              ])
              .then(function(answer) {
                if (answer.restart === "Yes") {
                  start();
                } else {
                  connection.end();
                }
              });
          }
        });
    });
  });
}
