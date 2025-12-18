import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Ruler, Weight, AlertTriangle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVehicleProfile, getVehicleProfiles } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  height: z.string().min(1, "Height is required"),
  heightInches: z.number().min(1, "Height in inches is required"),
  weight: z.string().min(1, "Weight is required"),
  length: z.string().min(1, "Length is required"),
  width: z.string().min(1, "Width is required"),
});

function parseHeightToInches(heightStr: string): number {
  const match = heightStr.match(/(\d+)'?\s*(\d+)?"?/);
  if (!match) return 162;
  const feet = parseInt(match[1]) || 0;
  const inches = parseInt(match[2]) || 0;
  return feet * 12 + inches;
}

export function VehicleForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profiles = [] } = useQuery({
    queryKey: ['vehicle-profiles'],
    queryFn: getVehicleProfiles,
  });

  const createProfileMutation = useMutation({
    mutationFn: createVehicleProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-profiles'] });
      toast({
        title: "Profile saved",
        description: "Your vehicle profile has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save vehicle profile.",
        variant: "destructive",
      });
    },
  });
  
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: profiles[0] || {
      name: "My Truck",
      height: "13' 6\"",
      heightInches: 162,
      weight: "80,000",
      length: "53'",
      width: "8' 6\"",
    },
  });

  function onSubmit(values: z.infer<typeof vehicleSchema>) {
    const heightInches = parseHeightToInches(values.height);
    createProfileMutation.mutate({
      ...values,
      heightInches,
    });
  }

  return (
    <Card className="border-l-4 border-l-primary bg-card/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-display tracking-wider">
          <Truck className="h-5 w-5 text-primary" />
          VEHICLE PROFILE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-widest">Profile Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background border-input focus-visible:ring-primary" data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-widest flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> Height
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background font-mono text-lg border-input focus-visible:ring-primary" data-testid="input-height" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-widest flex items-center gap-1">
                      <Weight className="h-3 w-3" /> Weight (lbs)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background font-mono text-lg border-input focus-visible:ring-primary" data-testid="input-weight" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-widest">Length</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background font-mono text-lg border-input focus-visible:ring-primary" data-testid="input-length" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-widest">Width</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background font-mono text-lg border-input focus-visible:ring-primary" data-testid="input-width" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <div className="bg-secondary/10 border border-secondary/20 p-3 rounded text-xs text-secondary-foreground flex gap-2 items-start mb-4">
                <AlertTriangle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <p>Routing will automatically avoid bridges lower than <span className="font-mono font-bold">{form.watch("height")}</span>.</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full font-display font-bold text-lg tracking-wide uppercase" 
                data-testid="button-update-profile"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}