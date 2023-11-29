import Head from "next/head";

import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Home() {

  const mystyle = {
    backgroundImage: "url(/images/preview.gif)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
    
  }

  return (
    <div className="min-h-screen w-full bg-primary" >
      <Header />
      <Hero />
    </div>
  );
}
