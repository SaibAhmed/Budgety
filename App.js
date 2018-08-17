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
    
    
    var data = {
        allItems: {    
            exp:[],    
            inc:[] 
        },
        totals:{
            exp:0,
            inc:0
        }
           
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
        expensesContainer:".expenses__list"
    };
    
    return{
      getInput:function(){
          return{
           type: document.querySelector(DOMstrings.inputType).value,//will be either inc or exp
           desciption : document.querySelector(DOMstrings.inputDescription).value,
           value : document.querySelector(DOMstrings.inputValue).value   
          };
     },
        
        addListItem:function (obj,type){
            var Html ,newHtml , element;
            //create HTML strings with placeholder text
            element = DOMstrings.incomeContainer;
            if(type === "inc"){
                 Html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type==="exp"){
                element = DOMstrings.expensesContainer;
                Html = '<div class="item clearfix" id="expense-%id%""><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual data
            newHtml = Html.replace("%id",obj.id);
            newHtml = newHtml.replace("%description%",obj.desciption);
            newHtml = newHtml.replace("%value%",obj.value);
             
            //Insert Html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend" , newHtml);
                
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
};
    
    
 var ctrlAddItem = function(){
 var input , newItem;           
////////////////TODO//////////////////////// 
     //1.get the input data
     input = UIctrl.getInput();
        
     
     //2.add the item to the budget controller
     newItem = budgetctrl.addItem(input.type, input.desciption, input.value);
     
     //3.add the new item to the function
     UIctrl.addListItem(newItem, input.type);
     //4.calculate the budget
     
     //5.display the budget on the UI
        };
    
    return{
        init:function(){
            console.log("App has started.");
            setUpEventListners();
        }
    };
    
})(budgetController,UIController);

Controller.init();