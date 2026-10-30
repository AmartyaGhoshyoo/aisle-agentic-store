import Hero from "./components/Hero";
import { Aisles, Ask, Brands, Finale, Footer, Nav, Stylist, Trust } from "./components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Aisles />
        <Ask />
        <Stylist />
        <Brands />
        <Trust />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
