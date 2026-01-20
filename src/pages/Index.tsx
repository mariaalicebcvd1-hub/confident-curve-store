import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import UrgencyBanner from "@/components/UrgencyBanner";
import ProductGallery, { ColorKey, colorFirstImageIndex } from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductDescription from "@/components/ProductDescription";
import SectionCTA from "@/components/SectionCTA";
import Reviews from "@/components/Reviews";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import FloatingVideoButton from "@/components/FloatingVideoButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { trackEventDirect, useTracking } from "@/hooks/useTracking";

const Index = () => {
  useTracking();
  const scrolledTrackedRef = useRef(false);

  const [selectedColor, setSelectedColor] = useState<ColorKey>("misto");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleColorChange = (color: ColorKey) => {
    setSelectedColor(color);
    // Direciona para a primeira imagem da cor selecionada
    setSelectedImageIndex(colorFirstImageIndex[color]);
  };

  useEffect(() => {
    const onScroll = () => {
      if (scrolledTrackedRef.current) return;

      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      if (progress >= 0.5) {
        scrolledTrackedRef.current = true;
        trackEventDirect('scroll', 'Scrolled 50%');
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Urgency Banner */}
      <UrgencyBanner />

      {/* Main Product Section */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Gallery */}
          <ProductGallery 
            selectedImageIndex={selectedImageIndex}
            onImageChange={setSelectedImageIndex}
          />

          {/* Product Info */}
          <ProductInfo 
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        </div>
      </main>

      {/* Product Description */}
      <ProductDescription />


      {/* Reviews Section */}
      <Reviews />

      {/* CTA após avaliações */}
      <SectionCTA 
        title="SÓ NO PIX: R$ 69,90 (kit com 3)"
        subtitle="No cartão: R$ 77,70 ou em até 12x de R$ 6,47 sem juros. Cada peça sai por menos de R$ 24."
        priceHighlight="Frete grátis • troca grátis • rastreio"
        trackingLabel="cta_after_reviews"
      />

      {/* Trust & Guarantee Section */}
      <TrustSection />

      {/* CTA após garantias */}
      <SectionCTA 
        title="Teste sem risco por 30 dias"
        subtitle="SÓ NO PIX: R$ 69,90 (kit com 3). No cartão: R$ 77,70 ou 12x de R$ 6,47 sem juros."
        buttonText="ESCOLHER COR E TAMANHO"
        trackingLabel="cta_after_trust"
      />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA final */}
      <SectionCTA 
        title="SÓ NO PIX: R$ 69,90 (kit com 3)"
        subtitle="No cartão: R$ 77,70 ou em até 12x de R$ 6,47 sem juros. Compra segura e você pode testar por 30 dias."
        priceHighlight="Frete grátis + rastreio por WhatsApp"
        buttonText="ESCOLHER MINHA COR E TAMANHO"
        trackingLabel="cta_after_faq"
      />

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Floating Video Button */}
      <FloatingVideoButton />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
