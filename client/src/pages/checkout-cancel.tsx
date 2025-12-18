import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Map, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            <Map className="text-primary-foreground h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white">
            CLEAR<span className="text-primary">HEIGHT</span>
          </h1>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-cancel-title">
              Checkout Cancelled
            </CardTitle>
            <CardDescription>
              Your payment was not processed. No charges have been made.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you encountered any issues or have questions about our plans,
              please don't hesitate to contact our support team.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/pricing">
                <Button className="w-full" data-testid="button-back-pricing">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Pricing
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full" data-testid="button-go-home">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
