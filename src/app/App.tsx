import React, { useEffect, useState } from "react";
import "./App.css";
import { getServices, postLogin, rebootService as restartService, Service } from "./Client";

export let logout: () => void;

function App() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<any>({});
  const [logged, setLogged] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  logout = () => {
    setLogged(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!logged) {
      const t = localStorage.getItem("token");
      if (t) setLogged(true);
    }
    if (logged) loadServices();
  }, [logged]);

  const loadServices = () =>
    getServices()
      .then(setServices)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));

  const confirmReboot = async (service: Service) => {
    if (!service.runningCount) return;
    if (window.confirm(`Are you sure you want to reboot all ${service.runningCount} tasks ??`)) {
      return rebootService(service);
    }
  };

  const rebootService = async (service: Service) => {
    setLoadingServices({ ...loadingServices, [service.serviceName]: true });
    await restartService(service.serviceName);
    await loadServices();
    setLoadingServices({ ...loadingServices, [service.serviceName]: false });
  };

  const login = async () => {
    try {
      setLoadingLogin(true);
      /* @ts-ignore */
      const u = document.getElementById("username").value;
      /* @ts-ignore */
      const p = document.getElementById("password").value;
      const t = await postLogin(u, p);

      localStorage.setItem("token", t);

      setLogged(true);
    } catch (err) {
      setLogged(false);
      localStorage.removeItem("token");
    } finally {
      setLoadingLogin(false);
    }
  };

  if (!logged)
    return (
      <div className="App login">
        <input type="text" id="username" placeholder="Username" />
        <input type="password" id="password" placeholder="Password" />
        <div className={`button ${loadingLogin ? "disabled" : ""}`} onClick={login}>
          {loadingLogin ? "Loading..." : "LOG IN"}
        </div>
      </div>
    );

  return (
    <div className="App">
      {loading ? (
        <p>
          <code>Loading...</code>
        </p>
      ) : (
        <div>
          <div className="service header">
            <p>SERVICE NAME</p>
            <p>STATUS</p>
            <p>RUNNING</p>
            <p>REBOOT</p>
          </div>
          {services.map((s) => {
            const status =
              s.runningCount >= s.desiredCount
                ? "good"
                : s.runningCount === 0 && s.desiredCount
                ? "warning"
                : "alert";
            return (
              <div className="service" key={s.serviceArn}>
                <p>{s.serviceName}</p>
                <p>{s.status}</p>
                <p className={`count ${status}`}>
                  {s.runningCount}/{s.desiredCount}
                </p>
                <p>
                  <span
                    className={`button reboot ${loadingServices[s.serviceName] ? "disabled" : ""}`}
                    onClick={() => confirmReboot(s)}>
                    {loadingServices[s.serviceName] ? "Loading..." : "REBOOT"}
                  </span>
                </p>
              </div>
            );
          })}
          <div className="button" onClick={logout}>
            LOGOUT
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
