import React, { useEffect, useState } from "react";
import "./App.css";
import { getServices, rebootService as restartService, Service } from "./Client";

function App() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<any>({});

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () =>
    getServices()
      .then(setServices)
      .catch((err) => console.log(err))
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
          {services.map((s) => (
            <div className="service" key={s.serviceArn}>
              <p>{s.serviceName}</p>
              <p>{s.status}</p>
              <p>
                {s.runningCount}/{s.desiredCount}
              </p>
              <p>
                <span
                  className={`reboot ${loadingServices[s.serviceName] ? "disabled" : ""}`}
                  onClick={() => confirmReboot(s)}>
                  {loadingServices[s.serviceName] ? "Loading..." : "REBOOT"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
