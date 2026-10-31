import { Ask, Brands, Footer, Trust } from "./components/Sections";
import Header from "./components/shop/Header";
import { CartDrawer, ProductSheet } from "./components/shop/Overlays";
import { Catalog, Deals, Departments, Hero, Promos } from "./components/shop/Storefront";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Promos />
        <Departments />
        <Deals />
        <Catalog />
        <Ask />
        <Brands />
        <Trust />
      </main>
      <Footer />
      <ProductSheet />
      <CartDrawer />
    </>
  );
}
