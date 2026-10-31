import { Brands, Footer, Trust } from "./components/Sections";
import Header from "./components/shop/Header";
import { CartDrawer, ProductSheet } from "./components/shop/Overlays";
import { AgentDesk, Gallery, Hero, Promos, Shelf } from "./components/shop/Storefront";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
