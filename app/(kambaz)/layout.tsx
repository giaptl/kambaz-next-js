"use client";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import Session from "./account/Session";
import store from "./store";
import { Provider } from "react-redux";
export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
 return (
   <Provider store={store}>
     <Session>
       <div id="wd-kambaz">
         <div className="d-flex">
           <div>
             <KambazNavigation />
           </div>
           <div className="wd-main-content-offset p-3 flex-fill">
             {children}
           </div>
         </div>
       </div>
     </Session>
   </Provider>
 );}

