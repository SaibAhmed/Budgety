//Budget Controller
var budgetController = (function(){
   
    
})(); 

//UIController Controller
var UIController = (function(){ 
    
})();

//Global App Controller
var Controller = (function (budgetctrl,UIctrl){
 var ctrlAddItem = function(){
            console.log("enter was pressed")
        //todo
//        1.get the input data
//        2.add the item to the budget controller
//        3.add the new item to the function
//        4.calculate the budget
//        5.display the budget on the UI
        }
    document.querySelector(".add__btn").addEventListener("clicked", function(){
});
     
    document.addEventListener("keypress", function(event){
        if(event.keyCode=== 13 || event.which === 13){
         ctrlAddItem();
        }
    });
})(budgetController,UIController);