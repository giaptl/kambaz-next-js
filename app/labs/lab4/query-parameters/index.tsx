"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function UrlEncoding() {
 const [a, setA] = useState("5");
 const [b, setB] = useState("10");
 const router = useRouter();
 const baseUrl = "/labs/lab4/url-encoding";


 // Programmatic navigation (using router.push)
 const goToQueryVersion = () => {
   const params = new URLSearchParams();
   params.set("a", a);
   params.set("b", b);
   router.push(`${baseUrl}/query-params?${params.toString()}`);
 };


 const goToPathVersion = () => {
   const safeA = encodeURIComponent(a);
   const safeB = encodeURIComponent(b);
   router.push(`${baseUrl}/path-params/${safeA}/${safeB}`);
 };


 return (
   <div style={{ padding: 40, maxWidth: 600 }}>
     <h2>Addition Calculator</h2>
     <p>
       Enter two numbers and navigate using either buttons (programmatic) or
       links (declarative):
     </p>
     <input
       type="number"
       value={a}
       onChange={(e) => setA(e.target.value)}
       className="form-control"
     />
     <input
       type="number"
       value={b}
       onChange={(e) => setB(e.target.value)}
       className="form-control"
     />
     <h4>Programmatic navigation (using router.push):</h4>
     <button onClick={goToQueryVersion} className="btn btn-success w-100">
       {a} + {b} → Query Params (programmatic)
     </button>
     <button onClick={goToPathVersion} className="btn btn-success w-100 mt-2">
       {a} + {b} → Path Params (programmatic)
     </button>
     <h4>Declarative navigation (using &lt;Link&gt;):</h4>
     <Link
       href={`${baseUrl}/query-params?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`}
       className="btn btn-primary w-100"
     >
       {a} + {b} → Query Params (Link)
     </Link>
     <Link
       href={`${baseUrl}/path-params/${encodeURIComponent(a)}/${encodeURIComponent(b)}`}
       className="btn btn-primary w-100 mt-2"
     >
       {a} + {b} → Path Params (Link)
     </Link>
   </div>
 );
}
