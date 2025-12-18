import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProductsWithPrices, createCheckoutSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Map, ArrowLeft, Loader2, Shield, Zap, Crown } from "lucide-react";
import { Link } from "wouter";

const PLAN_FEATURES: Record<string, string[]> = {
  "Basic": [
    "Up to 10 routes per month",
    "Basic bridge clearance data",
    "1 vehicle profile",
    "Email support"
  ],
  "Pro": [
    "Unlimited routes",
    "Real-time bridge updates",
    "Up to 5 vehicle profiles",
    "Route history & analytics",
    "Priority support"
  ],
  "Enterprise": [
    "Everything in Pro",
    "Unlimited vehicle profiles",
    "Fleet management tools",
    "API access",
    "Dedicated account manager"
  ]
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  "Basic": <Shield className="h-8 w-8 text-blue-400" />,
  "Pro": <Zap className="h-8 w-8 text-primary" />,
  "Enterprise": <Crown className="h-8 w-8 text-yellow-400" />
};

export default function Pricing() {
  const { toast } = useToast();
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-with-prices"],
    queryFn: getProductsWithPrices,
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ priceId, email }: { priceId: string; email: string }) =>
      createCheckoutSession(priceId, email),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (priceId: string) => {
    setSelectedPriceId(priceId);
    setIsDialogOpen(true);
  };

  const handleCheckout = () => {
    if (!selectedPriceId || !email) return;
    checkoutMutation.mutate({ priceId: selectedPriceId, email });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              <Map className="text-primary-foreground h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-widest text-white">
              CLEAR<span className="text-primary">HEIGHT</span>
            </h1>
          </Link>
        </div>
        <Link href="/">
          <Button variant="ghost" data-testid="link-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" data-testid="text-pricing-title">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get the clearance data you need to keep your fleet safe. Choose the plan that fits your needs.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-plans">
              No subscription plans available yet. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const price = product.prices[0];
              const isPopular = product.name === "Pro";
              const features = PLAN_FEATURES[product.name] || [];
              const icon = PLAN_ICONS[product.name];

              return (
                <Card
                  key={product.id}
                  data-testid={`card-plan-${product.id}`}
                  className={`relative flex flex-col ${
                    isPopular
                      ? "border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border-border"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">{icon}</div>
                    <CardTitle className="text-2xl" data-testid={`text-plan-name-${product.id}`}>
                      {product.name}
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {price && (
                      <div className="text-center mb-6">
                        <span className="text-4xl font-bold" data-testid={`text-price-${product.id}`}>
                          {formatPrice(price.unit_amount, price.currency)}
                        </span>
                        {price.recurring && (
                          <span className="text-muted-foreground">
                            /{price.recurring.interval}
                          </span>
                        )}
                      </div>
                    )}
                    <ul className="space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {price ? (
                      <Button
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                        onClick={() => handleSelectPlan(price.id)}
                        data-testid={`button-select-${product.id}`}
                      >
                        Get Started
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Contact Sales
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your email</DialogTitle>
            <DialogDescription>
              We'll use this email for your account and to send your receipt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={!email || checkoutMutation.isPending}
              data-testid="button-checkout"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Continue to Checkout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
