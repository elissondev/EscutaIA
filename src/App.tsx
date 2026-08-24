import { AppProvider, useApp } from "./lib/store";
import AuthScreen from "./components/AuthScreen";
import AppShell from "./components/AppShell";
import Dashboard from "./components/Dashboard";
import UploadPage from "./components/UploadPage";
import InboxPage from "./components/InboxPage";
import InsightsPage from "./components/InsightsPage";
import ReportsPage from "./components/ReportsPage";
import TeamPage from "./components/TeamPage";
import { Toasts } from "./components/ui";

function Router() {
  const { currentUser, route } = useApp();

  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <Toasts />
      </>
    );
  }

  return (
    <>
      <AppShell>
        {route === "dashboard" && <Dashboard />}
        {route === "upload" && <UploadPage />}
        {route === "inbox" && <InboxPage />}
        {route === "insights" && <InsightsPage />}
        {route === "reports" && <ReportsPage />}
        {route === "team" && <TeamPage />}
      </AppShell>
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
