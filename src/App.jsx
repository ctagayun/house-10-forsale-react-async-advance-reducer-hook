/*

Task: Using Reducer Hook
  


====================================================
Prev  Task: - show a loading indicator
     In order to show a loading indicator, one would need to introduce 
     a new stateful value. A boolean called isLoading may be the best solution.

     - When the side-effect which loads the data kicks in, set the stateful 
     boolean to true. Once the data loaded, set the stateful boolean to 
     false again.

     - In JSX, show a "Loading ..." text conditionally when the isLoading 
     boolean is set to true.

===================================================
Prev Task: Inline Handler in JSX:
  Task: The application renders a list of items and allows 
its users to filter the list via a search feature. Next the 
application should render a button next to each list item 
which allows its users to remove the item from the list.
  Optional Hints:

   -The list of items needs to become a stateful value 
   (here: stateful array) with useState in order to manipulate 
   it (e.g. removing an item) later.

   - Every list item renders a button with a click handler. 
   When clicking the button, the item gets removed from the 
   list by manipulating the state.

   - Since the stateful list resides in the App component, 
    one needs to use callback handlers to enable the Item 
    component to communicate up to the App component for 
    removing an item by its identifier.
===============================================================
 Previous Task: Side Effect    
    This exercise will implement a feature that will enable Search component
 to remember the most recent searched. 

    Let's implement this feature by using a side-effect to store the recent search 
 from the browser's local storage and retrieve it upon the initial component 
 initialization. First, use the local storage to store the searchTerm accompanied
  by an identifier whenever a user types into the HTML input field:

   What is useEffect?
      - Use useEffect Hook to trigger the desired side-effect each time 
     the searchTerm changes:

      - Use effect automatically runs after React completes running
      the component pure functions and the browser has been updated.
      In the function the "EFFECT" is performed. So we can fetch data
      from an API for example.
 ==============================================================
 Previous Task: React Controlled Components Task:
    - we modified the Search component. We added the value attribute
      
    <div className="float-start ">
            <label htmlFor="search">Search:</label>
            <input id="search" 
              value={props.search} <-- We added the value attribute
              type="text"
              onChange={props.onSearch}/> 
            <p> 
              Searching for <strong>{props.search}</strong>
            </p>
        </div>
    
    Here we added a "value" attribute instead of giving the 
    html element the freedom of keeping track of its internal state.
    Instead React uses state by leveraging the "value" attribute.
    Whenever the HTML search ox element emits change event the NEW VALUE 
    is WRITTEN to React states and RE-RENDERS the component. Then
    the HTML element uses the recent state as value again.
    
    - As a result because of the "value" attribute the input textbox 
      became EXPLICITLY controlled element and Search component became 
      IMPLICITLY a controlled component.

    Interview Questions:
      Question 1: What is a controlled component in React?
        Answer: A controlled component is a component whose 
               FORM elements are controlled by React state. 
                 
      Question 2: How do you create a controlled input in React?
       Answer: Set the input VALUE attribute to a state variable 
       and provide an onChange handler to update the state.

      Question 3: What is the role of the value prop in a controlled input element?
       Answer: The value prop sets the current value of the input, 
       making it a controlled component.

      Question 4: How do you handle a controlled checkbox in React?
         Answer: Use the checked attribute and provide an 
         onChange handler to update the corresponding state.

      Question 5: How do you clear the value of a controlled component?
        Answer: Set the state variable to an empty or null value to 
        clear the value of a controlled component.

      Question 6 : What are the potential downsides of using controlled 
      components?
        Answer: Controlled components can lead to verbose code, 
        especially in forms with many input elements. 
  ===============================================================     
  Previous Tasks:
    - create a search component
    - add code to display only the houses based on the search
      result.
    - add instantiation of Search component in App.jsx

  ===============================================================     
  Previous Task:
     - Create HouseList component
     - see discussion about React state in HouseList component.
     
  ===============================================================     

  Previous Task:
  Setup: 
    npm install bootstrap
    Once the installation is complete, we can include it in our app’s 
    entry file in main.jsx :
    --  Bootstrap CSS
    import "bootstrap/dist/css/bootstrap.min.css";
    -- Bootstrap Bundle JS
    import "bootstrap/dist/js/bootstrap.bundle.min";

    Now since we created the project with Vite, we can rely 
    on Vite's plugins to integrate ESLint properly. Run the 
    following command
       npm install vite-plugin-eslint --save-dev
    */
import * as React from 'react';
import './App.css'
import Header from "./header";
import HouseList from './house/houseList';
import Search from './house/search';

/*
      At the moment initialHouses is unstateful variable
      To gain control over the list, lets make it stateful.
      By using it as initial state in React's useState Hook. The 
      returned values from the array are the current state (stories) 
      and the state updater function (setStories):
    */
const initialHouses = [
    {
      objectID: 1,
      address: "12 Valley of Kings, Geneva",
      country: "Switzerland",
      price: 900000,
    },
    {
      objectID: 2,
      address: "89 Road of Forks, Bern",
      country: "Italy",
      price: 500000,
    },
    {
      objectID: 3,
      address: "1053 Lake Side Drive",
      country: "Netherlands",
      price: 600500,
    },
    {
      objectID: 4,
      address: "1916 Rustic Oak Road",
      country: "USA",
      price: 600900,
    },
    {
      objectID: 5,
      address: "1256 Macapagal Road",
      country: "Philippines",
      price: 700900,
    },
  ];

    /* The following  is a custom hook that will store the state in a 
     local storage. useStorageState which will keep the component's 
     state in sync with the browser's local storage.

    This custom hook returns
      1. state 
      2. and a state updater function
    and accepts an initial state as argument. 

     This is the custom hook before it was refactored to make it generic:
     const [searchTerm, setSearchTerm] = React.useState(''); 
        1. searchTerm renamed to 'value'
        2. setSearchTerm renamed to 'setValue'
  */
     const useStorageState = (key, initialState) => {
          const [value, setValue] = React.useState(
              localStorage.getItem('key') || initialState 
          );
          
          React.useEffect(() => {
            console.log('useEffect fired. Displaying value of dependency array ' + [ value, key]  );
              localStorage.setItem(key, value);  
              },
              [value, key]   //Dependency array
              ); //EOF useEffect
          
          //the returned values are returned as an array.
          return [value, setValue]; 
      
      } //EOF create custom hook
    
    /* Fetching data. We start off with a function that returns a 
     promise with data in its shorthand version once it resolves. 
     Even though the data should arrive asynchronously when we start the 
     application, it appears to arrive synchronously, because it's rendered 
     immediately. Let's change this by giving it a bit of a realistic delay.
     When resolving the promise, delay it for 2 seconds:
   */
    const getAsyncHouses = () =>
       new Promise((resolve) =>
       setTimeout(
         () => resolve({ data: { houses: initialHouses } }),
         2000
       )
     );

     
const App = () => {

   const welcome = {
     subject: 'List of ',
     title: 'Houses for Sale',
   };
 
  /* Call custom useStorageState hook to assign value to stateOfSearchComponent, 
  setSearchTerm */
  const [stateOfSearchComponent, setSearchTerm] =  useStorageState ( //<-- custom hook
    'search', //key
    '',  //Initial state
    );

  /* Step 1: First introduce a reducer function called housesReducer.
    we will move the "houses" state to reducerHook
      const [houses, setHouses] = React.useState([]);
  */
  
   const housesReducer = (state, action) => { 
     if (action.type === 'SET_STORIES') { //action is always associated 
                                          //with a type
          return action.payload; //if type matches a condition, return a 
                                 //a state the new state is simply "payload"
        } else {
          throw new Error(); //if type is not covered throw an error
        }
      };

   //Next replace const [houses, setHouses] = React.useState([]);
   //The new function receives a reducer function called "housesReducer"
   //and empty array [] and returns an array with two items:
   //houses (current state) and updateHouses (state updater funcion)
   const[houses, dispatchHouses] = React.useReducer(housesReducer, []);
 
   //Introduce another state called "isLoading" 
    const [isLoading, setIsLoading] = React.useState(false);

    //Introduce another state called "isError"
    const [isError, setIsError] = React.useState(false);

  /*Step 2: RESOLVE THE PROMISE AS A SIDE-EFECT
    We want to start off with an empty list of stories and simulate 
    fetching these stories asynchronously. In a new useEFFECT hook, call the 
    function and resolve the returned promise as a side-effect.*/
  React.useEffect(() => {
      //remember the first parameter to useEffect are a function(s)
      setIsLoading(true);

      getAsyncHouses()
       .then(result => { 
         dispatchHouses({ //replace this setHouses(result.data.houses);
            type: 'SET_STORIES',
            payload: result.data.houses,
          });
          setIsLoading(false);
         }) 
       .catch(() => setIsError(true));
    }, []); //remember second parameter is a dependency array
   
  /* Next we write event handler which removes an item from HouseList
      Select the record from the state called 'houses' based on the filter
      Here, the JavaScript array's built-in filter method creates
      a new filtered array called 'house'.

      The filter() method takes a function as an argument, 
    which accesses each item in the array and returns /
    true or false. If the function returns true, meaning the condition is 
    met, the item stays in the newly created array; if the function 
    returns false, it's removed from the filtered array.

      Pass this handler to List component when instantiating the component
    */
    const handleRemoveHouse = (item) => { 
        const newHouses = houses.filter(   
         (house) => item.objectID !== house.objectID
      );
      dispatchStories({   //replace this  setHouses(newHouses);
        type: 'SET_STORIES',
        payload: newStories,
      });
    };
  
    const handleAddHouse = (item) => { 
      const newHouses = houses.filter(   
       (house) => item.objectID !== house.objectID
    );
    //updater function updates the stateful variable 
    //called 'stories'. Since the state has changed
    //(e.g an item was deleted), the App, List, Item
    //components will re-render
    setHouses(newHouses);
  }

    const handleSearch = (event) => {
      setSearchTerm(event.target.value); 
    };

    //"houses" is the array of houses newly created by the filter() method.
    const searchedHouses = houses.filter((house) =>
      house.country.toLowerCase().includes(stateOfSearchComponent.toLowerCase())
     );

  return (
    <>
     <Header  headerText={welcome} />   

     <Search 
       id="search"
       value={stateOfSearchComponent}
       isFocused //pass imperatively a dedicated  prop. isFocused as an attribute is equivalent to isFocused={true}
       onInputChange={handleSearch}
      >
       <strong>Search with 1 sec delay:</strong>
      </Search>
      <br></br>

      {isError && <p>Error in fetching data...</p>}

      {isLoading ? (
        <p> Loading Data...</p>
      ):
       <HouseList list={searchedHouses} 
                   onRemoveHouse={handleRemoveHouse} 
                   onAddHouse={handleAddHouse} 
                   setHouses = {setHouses}/>  
      }
    
    </>
 )
}

export default App
