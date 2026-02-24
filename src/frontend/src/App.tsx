import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import PatientRegistrationForm from './components/PatientRegistrationForm';
import PatientHistoryTab from './components/PatientHistoryTab';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { UserPlus, History } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
          <header className="bg-cyan-500 shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-white text-center tracking-wide">
                THE DENTAL DOC
              </h1>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white border border-cyan-100 shadow-sm">
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2 text-base"
                >
                  <UserPlus className="h-4 w-4" />
                  Register Patient
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2 text-base"
                >
                  <History className="h-4 w-4" />
                  Patient History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="register" className="mt-0">
                <PatientRegistrationForm />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <PatientHistoryTab />
              </TabsContent>
            </Tabs>
          </main>
          
          <footer className="mt-16 bg-gray-50 border-t border-gray-200 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Clinic Information</h3>
                  <p className="text-gray-700">
                    <span className="font-medium">The Dental Doc</span>
                  </p>
                  <p className="text-gray-600">
                    Shop No. 137, First Floor<br />
                    Gera Imperium, Next to The Gera School<br />
                    Kadmaba Plateau, Goa
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Phone:</span> +91-7020391073
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Hours:</span> 10:30 AM - 7:30 PM
                  </p>
                  <p className="text-gray-600 text-xs">Sundays Closed</p>
                </div>
                
                <div className="space-y-2 md:text-right">
                  <h3 className="font-semibold text-gray-900 mb-3">Doctor Information</h3>
                  <p className="text-gray-700">
                    <span className="font-medium">Dr. Chandrakant Sharma</span>
                  </p>
                  <p className="text-gray-600">Reg No: A-1340</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                <p>
                  © {new Date().getFullYear()} The Dental Doc. Built with ❤️ using{' '}
                  <a
                    href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                      typeof window !== 'undefined' ? window.location.hostname : 'dental-doc'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
