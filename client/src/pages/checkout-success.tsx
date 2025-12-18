import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Map, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
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
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-success-title">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Thank you for subscribing to ClearHeight. Your account has been upgraded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You now have access to all the features included in your plan.
              A confirmation email has been sent to your inbox.
            </p>
            <Link href="/">
              <Button className="w-full" data-testid="button-go-home">
                Start Planning Routes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
