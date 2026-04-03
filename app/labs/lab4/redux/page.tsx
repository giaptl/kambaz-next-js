"use client"
import AddRedux from "./AddRedux";
import CounterRedux from "./CounterRedux";
import HelloRedux from "./hello";
import TodoList from "./todos/TodoList";
import { Provider } from "react-redux";
import store from "../store";

export default function ReduxExamples() {
 return (
  <Provider store={store}>
   <div>
     <h2>Redux Examples</h2>
     <HelloRedux/>
     <CounterRedux/>
     <AddRedux/>
     <TodoList/>
   </div>
   </Provider>
 );
}
