import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { Dashboard } from './components/Dashboard/Dashboard';
import { RoomAssessmentForm } from './components/RoomAssessment/RoomAssessmentForm';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'assessment' | 'welcome'>('welcome');

  const renderWelcome = () => (
    <div className="min-h-screen zen-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-zen-800 mb-2">
            🏡 Home Organization Intelligence
          </CardTitle>
          <p className="text-xl text-zen-600 font-serif">
            Transform chaos into harmony with data-driven organization
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-zen-700 leading-relaxed">
            Combining the wisdom of Marie Kondo, Toyota's 5S methodology, Lean Six Sigma,
            and Eastern philosophy to create a comprehensive approach to home organization.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-zen-600">
            <div className="space-y-2">
              <div className="font-semibold">✨ Marie Kondo</div>
              <div>Joy-sparking decisions</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">🏭 Toyota 5S</div>
              <div>Systematic efficiency</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">📊 Lean Six Sigma</div>
              <div>Waste elimination</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">☯️ Eastern Philosophy</div>
              <div>Energy flow & mindfulness</div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={() => setCurrentView('dashboard')}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => setCurrentView('assessment')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Start Room Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return renderWelcome();
      case 'assessment':
        return (
          <div className="min-h-screen zen-gradient p-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('dashboard')}
                  className="mb-4"
                >
                  ← Back to Dashboard
                </Button>
              </div>
              <RoomAssessmentForm
                onComplete={() => setCurrentView('dashboard')}
                onCancel={() => setCurrentView('dashboard')}
              />
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen bg-zen-50">
            <Dashboard
              onStartAssessment={() => setCurrentView('assessment')}
            />
          </div>
        );
      default:
        return renderWelcome();
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          {renderContent()}
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
