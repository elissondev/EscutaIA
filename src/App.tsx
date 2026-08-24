import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./lib/store";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import AppShell from "./components/AppShell";
import Dashboard from "./components/Dashboard";
import UploadPage from "./components/UploadPage";
import InboxPage from "./components/InboxPage";
import InsightsPage from "./components/InsightsPage";
import ReportsPage from "./components/ReportsPage";
import TeamPage from "./components/TeamPage";
import { Toasts } from "./components/ui";

function Root() {
  const { currentUser, route } = useApp();
  const [view, setView] = useState<"landing" | "app">(() => (currentUser ? "app" : "landing"));

  useEffect(() => {
    if (currentUser) setView("app");
  }, [currentUser]);

  if (view === "landing") {
    return (
      <>
        <LandingPage onEnter={() => setView("app")} />
        <Toasts />
      </>
    );
  }

  return (
    <>
      {!currentUser ? (
        <AuthScreen onBack={() => setView("landing")} />
      ) : (
        <AppShell>
          {route === "dashboard" && <Dashboard />}
          {route === "upload" && <UploadPage />}
          {route === "inbox" && <InboxPage />}
          {route === "insights" && <InsightsPage />}
          {route === "reports" && <ReportsPage />}
          {route === "team" && <TeamPage />}
        </AppShell>
      )}
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
