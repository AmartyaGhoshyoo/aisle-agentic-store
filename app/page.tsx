import { Brands, Footer, Trust } from "./components/Sections";
import Header from "./components/shop/Header";
import { CartDrawer, ProductSheet } from "./components/shop/Overlays";
import { AgentDesk, Gallery, Promos, Shelf } from "./components/shop/Storefront";
import FilmHero from "./components/shop/FilmHero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <FilmHero />
        <Gallery />
        <AgentDesk />
        <Shelf />
        <Promos />
        <Brands />
        <Trust />
      </main>
      <Footer />
      <ProductSheet />
      <CartDrawer />
    </>
  );
}
