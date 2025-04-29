import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShopCTA() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Explore Our Products</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Discover our wide range of high-quality products across various categories.
          From electronics to fashion, we have everything you need.
        </p>
        <Link href="/shop" passHref>
          <Button size="lg" className="font-semibold">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
}