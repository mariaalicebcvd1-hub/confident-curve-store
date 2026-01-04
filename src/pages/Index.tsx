import { useState } from "react";
import TopBar from "@/components/TopBar";
import UrgencyBanner from "@/components/UrgencyBanner";
import ProductGallery, { ColorKey, colorFirstImageIndex } from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductDescription from "@/components/ProductDescription";

import Reviews from "@/components/Reviews";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import FloatingVideoButton from "@/components/FloatingVideoButton";
import RecentPurchasePopup from "@/components/RecentPurchasePopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const Index = () => {
  const [selectedColor, setSelectedColor] = useState<ColorKey>("misto");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleColorChange = (color: ColorKey) => {
    setSelectedColor(color);
    // Direciona para a primeira imagem da cor selecionada
    setSelectedImageIndex(colorFirstImageIndex[color]);
  };

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

      {/* Trust & Guarantee Section */}
      <TrustSection />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Floating Video Button */}
      <FloatingVideoButton />

      {/* Recent Purchase Popup */}
      <RecentPurchasePopup />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
