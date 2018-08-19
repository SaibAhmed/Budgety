//Budget Controller
var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id=id;
        this.desciption=description;
        this.value=value;
    }
    
    var Income = function(id,description,value){
        this.id=id;
        this.desciption=description;
        this.value=value;
    }
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
            
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {    
            exp:[],    
            inc:[] 
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
        
    };
    
    return {
      
        addItem:function(type,des,val){
            var newItem , ID;
           
            if(data.allItems[type].length > 0){
                //Create new id
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            
            //Create new item based on "inc" or "exp type"
            if(type === "exp"){
                newItem = new Expense(ID,des,val);
            }else if(type === "inc"){
                newItem = new Income(ID,des,val);
            }
            
            //push it into dataStructure
            data.allItems[type].push(newItem);
            
            //return the item
            return newItem;
        },
        
        calculateBudget:function(){
            
            //calculate total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");
            
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income the we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100); 
            }
            else{
                data.percentage=-1;
            }
            
        },
        
        getBudget:function(){
          return{
              budget:data.budget,
              totalInc:data.totals.inc,
              totalExp:data.totals.exp,
              percentage:data.percentage
              
          };  
        },
        
        testing:function(){
            console.log(data);
        }
        
        
    };
    
    
    
})();     
//UIController Controller
var UIController = (function(){ 
    
    var DOMstrings = {
        inputType:".add__type",
        inputDescription:".add__description",
        inputValue:".add__value",
        inputBtn:".add__btn",
        incomeContainer:".income__list",
        expensesContainer:".expenses__list",
        budgetLabel:".budget__value",
        incomeLabel:".budget__income--value",
        expenseLabel:".budget__expenses--value",
        percentageLabel:".budget__expenses--percentage",
        container:".container"
    };
    
    return{
      getInput:function(){
          return{
           type: document.querySelector(DOMstrings.inputType).value,//will be either inc or exp
           desciption : document.querySelector(DOMstrings.inputDescription).value,
           value : parseFloat(document.querySelector(DOMstrings.inputValue).value)   
          };
     },
        
        addListItem:function (obj,type){
            var Html ,newHtml , element;
            //create HTML strings with placeholder text
            element = DOMstrings.incomeContainer;
            if(type === "inc"){
                 Html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type==="exp"){
                element = DOMstrings.expensesContainer;
                Html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual data
            newHtml = Html.replace("%id",obj.id);
            newHtml = newHtml.replace("%description%",obj.desciption);
            newHtml = newHtml.replace("%value%",obj.value);
             
            //Insert Html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend" , newHtml);
                
        },
        
        clearFields : function(){
            var fields,fieldsArray ;
            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            
            fieldsArray =  Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current , index ,array){
                current.value = "";
                
            });
            fieldsArray[0].focus();
        }, 
        
        displayBudget : function(obj){
             document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
             document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
             
            
             if(obj.percentage > 0){
                 document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ " %";
             }else{
                 document.querySelector(DOMstrings.percentageLabel).textContent = "---";
             }
        },
        
        getDomStrings:function(){
            return DOMstrings;
        }
    };
})();

//Global App Controller
var Controller = (function (budgetctrl,UIctrl){
    
    var Dom = UIctrl.getDomStrings();
    
    var setUpEventListners = function(){
        document.querySelector(Dom.inputBtn).addEventListener("click", ctrlAddItem);
     
    document.addEventListener("keypress", function(event){
        if(event.keyCode=== 13 || event.which === 13){
         ctrlAddItem();
        }
    
    });
        
    document.querySelector(Dom.container).addEventListener("click",ctrlDeleteItem);    
};
    
    var updateBudget = function(){
        
        //1.calculate the budget
         budgetctrl.calculateBudget();
        
        //2.return the budget
        var budget = budgetctrl.getBudget();
     
        //3.display the budget on the UI
        UIctrl.displayBudget(budget);
    };
    
 var ctrlAddItem = function(){
 var input , newItem;           
////////////////TODO//////////////////////// 
     //1.get the input data
     input = UIctrl.getInput();
        
     if(input.desciption !=="" && !isNaN(input.value) && input.value>0 ){
     //2.add the item to the budget controller
     newItem = budgetctrl.addItem(input.type, input.desciption, input.value);
     
     //3.add the new item to the function
     UIctrl.addListItem(newItem, input.type);
     
     //4.clear the fields
     UIctrl.clearFields();
     
     //5.calculate and update budget
     updateBudget();
     }
    };
    
    var ctrlDeleteItem = function(event){
        var itemId,splitId,type,ID;
        
        itemId=(event.target.parentNode.parentNode.parentNode.parentNode.id);
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        if(itemId){
            
            //inc-1
            splitId = itemId.split("-"); 
            type=splitId[0];
            ID=splitId[1];
        }
    };
    
    
    return{
        init:function(){
            console.log("App has started.");
            UIctrl.displayBudget({
              budget:0,
              totalInc:0,
              totalExp:0,
              percentage:-1
              
           });
            setUpEventListners();
        }
    };
    
})(budgetController,UIController);

Controller.init();