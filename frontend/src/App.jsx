import "./App.css";

import AuroraBackground from "./components/AuroraBackground";

import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Certificates from "./components/Certificates";
import Achievements from "./components/Achievements";
import Footer from "./components/Footer";
import Stats from "./components/Stats";
import PortfolioChatbot from "./components/PortfolioChatbot";

import information from "./data/Information.json";

function App() {

  return (
    <>
      <AuroraBackground />

      <main className="main-content">

        <Hero information={information} />

        <Stats information={information} />

        <About information={information} />

        <Skills information={information} />

        <Experience information={information} />
        
        <Projects information={information} />

        <Certificates information={information} />

        <Achievements information={information} />

        <PortfolioChatbot />
        
        <Footer />

      </main>
    </>
  );
}

export default App;