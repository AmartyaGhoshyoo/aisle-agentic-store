import { Brands, Footer, Trust } from "./components/Sections";
import Header from "./components/shop/Header";
import { CartDrawer, ProductSheet } from "./components/shop/Overlays";
import { AgentDesk, Hero, Promos, Shelf } from "./components/shop/Storefront";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
