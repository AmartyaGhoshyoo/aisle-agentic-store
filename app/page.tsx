import Hero from "./components/Hero";
import Journey from "./components/Journey";
import { Agents, Finale, Footer, Merchant, Nav, Shelf, Trust } from "./components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shelf />
        <Journey />
        <Agents />
        <Merchant />
        <Trust />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
