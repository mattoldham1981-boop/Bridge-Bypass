import { VehicleForm } from "@/components/vehicle-form";
import { MapView } from "@/components/map-view";
import { Map, Menu, Settings, Bell, Search, LayoutDashboard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getBridges } from "@/lib/api";
import generatedImage from '@assets/generated_images/industrial_concrete_texture_with_yellow_caution_stripes.png';

export default function Home() {
  const { data: bridges = [] } = useQuery({
    queryKey: ['bridges'],
    queryFn: getBridges,
  });
  
  const lowClearanceBridges = bridges
    .filter(b => b.clearanceInches < 162)
    .sort((a, b) => a.clearanceInches - b.clearanceInches)
    .slice(0, 2);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden font-sans text-foreground">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              <Map className="text-primary-foreground h-5 w-5" />
           </div>
           <h1 className="text-xl font-bold tracking-widest text-white">CLEAR<span className="text-primary">HEIGHT</span></h1>
        </div>
        
        <div className="flex-1 max-w-md mx-12 hidden md:block">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search destination..." 
                    className="pl-9 bg-background/50 border-muted focus:border-primary"
                />
            </div>
        </div>

        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="font-bold text-xs">JD</span>
            </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div 
            className="absolute inset-0 opacity-5 pointer-events-none z-0"
            style={{ backgroundImage: `url(${generatedImage})`, backgroundSize: 'cover' }}
        />

        {/* Sidebar Navigation */}
        <aside className="w-20 border-r border-border bg-card hidden md:flex flex-col items-center py-6 gap-6 z-10">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-primary/10 text-primary">
                <LayoutDashboard className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-muted/50">
                <Map className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-muted/50">
                <Menu className="h-6 w-6" />
            </Button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row relative z-10">
            
            {/* Vehicle Config Panel */}
            <div className="w-full md:w-[400px] p-4 md:p-6 flex flex-col gap-4 overflow-y-auto bg-background/95 md:bg-transparent border-b md:border-b-0 md:border-r border-border order-2 md:order-1 z-20 shadow-2xl">
                <div className="md:hidden w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
                
                <div className="mb-2">
                    <h2 className="text-2xl font-display font-bold text-white mb-1">ROUTE PLANNER</h2>
                    <p className="text-muted-foreground text-sm">Optimized for safe clearance</p>
                </div>

                <VehicleForm />

                <div className="bg-card/50 border border-border rounded-lg p-4 mt-4">
                    <h3 className="font-display font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Active Hazards Nearby</h3>
                    
                    {lowClearanceBridges.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Loading hazards...</p>
                    ) : (
                      <div className="space-y-3">
                        {lowClearanceBridges.map((bridge) => (
                          <div key={bridge.id} className="flex gap-3 items-start p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer group">
                              <div className="h-8 w-8 rounded bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-1">
                                  <AlertTriangle className="h-4 w-4" />
                              </div>
                              <div>
                                  <div className="font-bold text-destructive group-hover:underline">{bridge.name}</div>
                                  <div className="text-xs text-muted-foreground">Clearance: {bridge.clearanceHeight} • {bridge.city}, {bridge.state}</div>
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative order-1 md:order-2 min-h-[300px]">
                <MapView />
                
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block z-[400]" />
            </div>

        </main>
      </div>
    </div>
  );
}