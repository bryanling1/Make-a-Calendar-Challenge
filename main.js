// I know I shouldn't
let time_conflict = false;
let appended = false;
let temp_tree = {
    parent: "root",
    children: []
};
let output = [];

/** 
* layOutDay.
*
* Determines best layout for calendar and displays directly to the DOM.
*
* @see compare 
* @see doesNodeHaveTimeConflict
* @see pushTreeToArray
* @see insertEventInTree
* @see eventsToCalendarDisplay
*
* @global
*
* @param {Object[]} events An array of events objects with start and end properties, minutes from 9 AM.
*
* @return {null} Displays result directy to the DOM.
*/
function layOutDay(events) {
    output = [];
    events.sort(compare);
    events.forEach(event=>{
        if (temp_tree.children.length === 0){
            temp_tree.children.push({parent:event});
            return;
        }
        doesNodeHaveTimeConflict(event, temp_tree);
        if(!time_conflict){
            pushTreeToArray(temp_tree);
            temp_tree.children = [];
            temp_tree.children.push({parent: event});
            return;
        }
        insertEventInTree(event, temp_tree);
        appended = false;
        time_conflict = false;
    })

    //handle last tree
    if (temp_tree.children.length > 0){
        pushTreeToArray(temp_tree);
    }
    appended = false;
    time_conflict = false;
    temp_tree.children = [];
    eventsToCalendarDisplay(output);
}

/** 
* compare.
*
* Custom compare function for sort to be used with '.sort()' on array of events as they
* they need be in order for logic to work.
*
* @global
*
* @param {Object} a Event object with start and end properties.
* @param {Object} b Next object with start and end properties.
*
* @return {int} -1 for higher in the order.
*/

function compare(a, b){
    if(a.start < b.start){
        return -1;
    }
    return 1;
}

/** 
* isTimeConflict.
*
* Determines if two events have a time conflict
*
* @global
*
* @param {Object} time1 Event object.
* @param {Object} time2 Event object to compare.
*
* @return {Boolean} true or false.
*/

function isTimeConflict(time1, time2){
    if(time2.start >= time1.start && time2.start < time1.end){
        return true;
    }
    return false;
}

/** 
* doesNodeHaveTimeConflict.
*
* Traverses the temporary tree to see if a time confict exists
*
* @see isTimeConflict
*
* @global
*
* @param {Object} node Event object to be compared.
* @param {Object} tree Tree to traverse.
*
* @return {null} Updates time conflict global variable if one is found
*/

function doesNodeHaveTimeConflict(node, tree){ 
    if(time_conflict){
        return;
    }
    if(isTimeConflict(tree.parent, node)){
        time_conflict = true;
        return;
    }
    if (tree.children){
        tree.children.forEach(function(child){
            return doesNodeHaveTimeConflict(node, child);      
        });
    }
}

/** 
* insertEventInTree.
*
* Assumes the given node has a time conflict within the tree, finds next available position
* by post order traversal (last option is to make a new column)
*
* @see isTimeConflict
*
* @global
*
* @param {Object} node Event object to be inserted.
* @param {Object} tree Tree to traverse.
*
* @return {null} Temp tree how has the new node inserted.
*/

function insertEventInTree(node, tree){
    if(appended){
        return;
    }
    if (!isTimeConflict(tree.parent, node)){
        if(tree.children){
            tree.children.forEach(function(child){
                return insertEventInTree(node, child);
            })
        }
        
    }
    if(!appended){
        if(!isTimeConflict(tree.parent, node)){
            if(!tree.children){
                tree.children = [];
            }
            tree.children.push({parent: node});
            appended = true;
        }
    }
}

/** 
* pushTreeToArray
*
* From the temporary tree, pushes each node into the an array, adding properties width and left for 
* positioning in the DOM. 
*
* @global
*
* @param {Object} tree Tree to traverse.
*
* @return {null} Pushes to global output array.
*/

function pushTreeToArray(tree){
    if(tree.parent !== "root"){
        output.push({data:tree.parent, width:tree.width, left:tree.left});
    }
    if (tree.children){
        tree.children.forEach((child, i)=>{
            child.width = ((tree.width?tree.width:100)) / tree.children.length;
            child.left = tree.left?(tree.left):(0) + i * ((tree.width?tree.width:100) / tree.children.length);
            pushTreeToArray(child);
        });
    }
}

/** 
* displayCalendarTimes.
*
* Displays calendar times (9AM to 9PM) on left side of calendar in the DOM
*
* @global
*
* @return {null} Times are rendered in the DOM
*/

function displayCalendarTimes(){
    const reference = document.getElementById("calendar-times");
    for (let i=0; i<12; i++){
        if(i < 3){
            reference.innerHTML += "<span>"+(9+i)+":00</span> AM<br/>"+(9+i)+":30<br/>";
        }else if(i == 3){
            reference.innerHTML += "<span>12:00</span> PM<br/>12:30<br/>";
        }else{
            reference.innerHTML += "<span>"+(i-3)+":00</span> PM<br/>"+(i-3)+":30<br/>";
        }
    }
    reference.innerHTML += "<span>9:00</span> PM";
}

/** 
* displayCalendarTimes.
*
* Displays calendar times (9AM to 9PM) on left side of calendar in the DOM
*
* @global
*
* @return {null} Times are rendered in the DOM
*/

function eventsToCalendarDisplay(events){
    const calendarRef = document.getElementById("calendar-main");
    calendarRef.innerHTML = '';
    if(events){
        events.forEach(event=>{
            calendarRef.innerHTML +=    `<div class="event" style="
                                        width: `+ event.width +`%; 
                                        top:`+ event.data.start +`px; 
                                        height: `+ (event.data.end - event.data.start)+`px;
                                        left:  `+ (event.left)+`%">
                                        <span>Sample Item</span><br/>Sample Location
                                        </div><br/>`
        });
    }
}
displayCalendarTimes();




