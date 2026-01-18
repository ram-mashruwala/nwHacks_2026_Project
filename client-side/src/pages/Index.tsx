import { OptionsStrategyBuilder } from "@/components/options/OptionsStrategyBuilder";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <Header />
        <OptionsStrategyBuilder />
      </div>
    </div>
  );
};

export default Index;
