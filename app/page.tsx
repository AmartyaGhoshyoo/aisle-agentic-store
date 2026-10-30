import Hero from "./components/Hero";
import { Ask, Categories, Brands, Finale, Footer, Nav, Stylist, Trust } from "./components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Categories />
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
