"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";

type ShippingOptionKey = "standard" | "intermediate" | "pickup";

const SHIPPING_OPTIONS: Record<ShippingOptionKey, { label: string; description: string; price: number }[]> = {
  standard: [
    { label: "Mensajería estándar", description: "Ciudades principales 1–4 días hábiles", price: 8000 },
  ],
  intermediate: [
    { label: "Mensajería intermedia", description: "Ciudades intermedias 2–5 días hábiles", price: 12000 },
  ],
  pickup: [{ label: "Recoger en tienda", description: "Sin costo. Te contactaremos para coordinar.", price: 0 }],
};

const DEPARTMENTS = [
  "Antioquia",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Cauca",
  "Cesar",
  "Córdoba",
  "Cundinamarca",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Quindío",
  "Risaralda",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Bogotá D.C.",
];

const PAYMENT_METHODS = [
  {
    key: "bold",
    title: "Bold – Pagos Digitales, PSE y Pagos Internacionales",
    logos: ["/payments/visa-logo.png", "/payments/mastercard-logo.png", "/payments/pse-logo.png"],
    description:
      "Serás redirigido a Bold para completar el pago de forma segura.",
  },
  {
    key: "transfer",
    title: "Transferencia Bancolombia, Nequi o Daviplata",
    logos: ["/payments/bancolombia-logo.png", "/payments/nequi-logo.png", "/payments/daviplata-logo.png"],
    description: "Te enviaremos los datos para la transferencia al confirmar.",
  },
  {
    key: "card",
    title: "Tarjeta de Crédito o Débito",
    logos: ["/payments/visa-logo.png", "/payments/mastercard-logo.png", "/payments/maestro-logo.png"],
    description: "Procesaremos tu pago con gateway seguro.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();

  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [country] = useState("Colombia");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("Valle del Cauca");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);

  const [shippingCategory, setShippingCategory] = useState<ShippingOptionKey>("standard");
  const [shippingIndex, setShippingIndex] = useState(0);
  const selectedShipping = SHIPPING_OPTIONS[shippingCategory][shippingIndex];

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].key);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrencyInt = (value: number | string) => Math.round(Number(value)).toLocaleString("es-CO");
  const CO_IVA_STANDARD_RATE = 0.19;
  const getItemTaxRate = (item: any) => {
    if (item?.isTaxExempt || item?.taxExempt) return 0;
    const rate = typeof item?.taxRate === "number" ? item.taxRate : CO_IVA_STANDARD_RATE;
    return Math.max(0, rate);
  };

  const subtotal = useMemo(() => getCartTotal(), [getCartTotal, cartItems]);
  const ivaAmount = useMemo(
    () =>
      Math.round(
        cartItems.reduce((acc, item: any) => {
          const rate = getItemTaxRate(item);
          const base = (+item.price) * item.quantity;
          return acc + base * rate;
        }, 0)
      ),
    [cartItems]
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const total = subtotal + ivaAmount + shippingCost;

  useEffect(() => {
    if (saveInfo) {
      const data = {
        email,
        subscribe,
        firstName,
        lastName,
        documentId,
        address,
        address2,
        city,
        department,
        postalCode,
        phone,
      };
      if (typeof window !== "undefined") localStorage.setItem("checkoutInfo", JSON.stringify(data));
    }
  }, [saveInfo, email, subscribe, firstName, lastName, documentId, address, address2, city, department, postalCode, phone]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("checkoutInfo");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setEmail(data.email || "");
          setSubscribe(!!data.subscribe);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setDocumentId(data.documentId || "");
          setAddress(data.address || "");
          setAddress2(data.address2 || "");
          setCity(data.city || "");
          setDepartment(data.department || "Valle del Cauca");
          setPostalCode(data.postalCode || "");
          setPhone(data.phone || "");
        } catch {}
      }
    }
  }, []);

  const validate = () => {
    if (!email || !email.includes("@")) return "Correo electrónico inválido";
    if (!firstName || !lastName) return "Nombre y apellidos son obligatorios";
    if (!address || !city || !department) return "Dirección, ciudad y departamento son obligatorios";
    if (!phone) return "Teléfono es obligatorio";
    if (cartItems.length === 0) return "El carrito está vacío";
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Pedido confirmado. Redirigiendo al pago...");
      router.push("/checkout/success");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-md border p-4">
              <h2 className="text-lg font-semibold mb-4">Contacto</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="subscribe" checked={subscribe} onCheckedChange={(v) => setSubscribe(Boolean(v))} />
                  <Label htmlFor="subscribe">Enviar novedades y ofertas por correo electrónico</Label>
                </div>
              </div>
            </section>

            <section className="rounded-md border p-4">
              <h2 className="text-lg font-semibold mb-4">Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>País / Región</Label>
                  <Input value={country} readOnly />
                </div>
                <div></div>
                <div>
                  <Label>Nombre</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label>Apellidos</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Documento de Identidad</Label>
                  <Input value={documentId} onChange={(e) => setDocumentId(e.target.value)} placeholder="CC / CE" />
                </div>
                <div className="md:col-span-2">
                  <Label>Dirección</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número" />
                </div>
                <div className="md:col-span-2">
                  <Label>Casa, apartamento, etc. (opcional)</Label>
                  <Input value={address2} onChange={(e) => setAddress2(e.target.value)} />
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>Provincia / Estado</Label>
                  <select className="w-full h-10 rounded-md border bg-transparent px-3 py-2 text-sm" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Código postal (opc.)</Label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <div className="flex items-center gap-2">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center space-x-2 mt-2">
                  <Checkbox id="saveInfo" checked={saveInfo} onCheckedChange={(v) => setSaveInfo(Boolean(v))} />
                  <Label htmlFor="saveInfo">Guardar mi información para la próxima vez</Label>
                </div>
              </div>
            </section>

            <section className="rounded-md border p-4">
              <h2 className="text-lg font-semibold mb-4">Métodos de envío</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button className={`px-3 py-1 rounded-md border ${shippingCategory === "standard" ? "bg-gray-100" : "bg-transparent"}`} onClick={() => { setShippingCategory("standard"); setShippingIndex(0); }}>Ciudades principales</button>
                  <button className={`px-3 py-1 rounded-md border ${shippingCategory === "intermediate" ? "bg-gray-100" : "bg-transparent"}`} onClick={() => { setShippingCategory("intermediate"); setShippingIndex(0); }}>Ciudades intermedias</button>
                  <button className={`px-3 py-1 rounded-md border ${shippingCategory === "pickup" ? "bg-gray-100" : "bg-transparent"}`} onClick={() => { setShippingCategory("pickup"); setShippingIndex(0); }}>Recoger en tienda</button>
                </div>
                {SHIPPING_OPTIONS[shippingCategory].map((opt, idx) => (
                  <label key={idx} className="flex items-center justify-between rounded-md border p-3 cursor-pointer">
                    <div className="flex items-center">
                      <input type="radio" className="mr-3" name="shipping-option" checked={shippingIndex === idx} onChange={() => setShippingIndex(idx)} />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.description}</p>
                      </div>
                    </div>
                    <div className="font-medium">${formatCurrencyInt(opt.price)}</div>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-md border p-4">
              <h2 className="text-lg font-semibold mb-4">Pago</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.key} className="flex items-center justify-between rounded-md border p-3 cursor-pointer">
                    <div className="flex items-center">
                      <input type="radio" className="mr-3" name="payment-method" checked={paymentMethod === pm.key} onChange={() => setPaymentMethod(pm.key)} />
                      <div>
                        <p className="font-medium">{pm.title}</p>
                        <p className="text-sm text-muted-foreground">{pm.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pm.logos.map((src, i) => (
                        <Image key={i} src={src} alt="logo" width={24} height={24} className="object-contain" />
                      ))}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Dirección de facturación</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="billing" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} />
                    <span>La misma dirección de envío</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="billing" checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} />
                    <span>Usar una dirección de facturación distinta</span>
                  </label>
                </div>
                {!billingSameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="md:col-span-2">
                      <Label>Dirección de facturación</Label>
                      <Input placeholder="Calle, número" />
                    </div>
                    <div>
                      <Label>Ciudad</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Departamento</Label>
                      <select className="w-full h-10 rounded-md border bg-transparent px-3 py-2 text-sm">
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Código postal</Label>
                      <Input />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex justify-end">
              <Button className="w-full md:w-auto" size="lg" onClick={handleSubmit} disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Procesando
                  </>
                ) : (
                  "Pagar ahora"
                )}
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 md:p-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">${formatCurrencyInt((+item.price) * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${formatCurrencyInt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>${formatCurrencyInt(ivaAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>${formatCurrencyInt(shippingCost)}</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${formatCurrencyInt(total)}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Los impuestos se calculan según normativa vigente en Colombia.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}