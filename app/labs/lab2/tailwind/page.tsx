import "./index.css";
import TailwindSpacing from "./TailwindSpacing";
import TailwindTypography from "./TailwindTypography";
import TailwindBackgroundColors from "./TailwindBackgroundColors";
import TailwindResponsiveDesign from "./TailwindResponsiveDesign";
import TailwindFilters from "./TailwindFilters";
import TailwindGrids from "./TailwindGrids";

export default function TailwindLab() {
 return (
   <div className="p-8">
     <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
     <TailwindSpacing/>
     <TailwindTypography/>
     <TailwindBackgroundColors/>
     <TailwindResponsiveDesign/>
     <TailwindFilters/>
     <TailwindGrids/>
   </div>
 );
}
