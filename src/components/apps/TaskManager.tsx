import React, { useState, useEffect } from 'react';
import { WindowState } from '../../types/os';
import { AppIcon } from '../common/AppIcon';
import { soundEngine } from '../../utils/sound';
import './task-manager.css';

interface TaskManagerProps {
  windows: WindowState[];
  onEndTask: (windowId: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ windows, onEndTask }) => {
  const [activeTab, setActiveTab] = useState<'processes' | 'performance'>('processes');
  const [selectedWinId, setSelectedWinId] = useState<string | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([14, 22, 18, 30, 24, 15, 12, 28, 35, 19]);
  const [currentCpu, setCurrentCpu] = useState<number>(18);
  const [currentRam, setCurrentRam] = useState<number>(7.2);

  useEffect(() => {
    const timer = setInterval(() => {
      const activeCount = windows.length;
      const baseCpu = 8 + activeCount * 4;
      const jitter = Math.floor(Math.random() * 8) - 4;
      const newCpu = Math.max(5, Math.min(95, baseCpu + jitter));
      setCurrentCpu(newCpu);
      setCpuHistory((prev) => [...prev.slice(-19), newCpu]);

      const baseRam = 6.4 + activeCount * 0.45;
      setCurrentRam(parseFloat((baseRam + (Math.random() * 0.2 - 0.1)).toFixed(1)));
    }, 1200);

    return () => clearInterval(timer);
  }, [windows.length]);

  const handleEndTask = () => {
    if (!selectedWinId) return;
    soundEngine.playClick();
    onEndTask(selectedWinId);
    setSelectedWinId(null);
  };

  return (
    <div className="task-manager">
      <div className="task-manager-tabs">
        <button
          onClick={() => {
            setActiveTab('processes');
            soundEngine.playClick();
          }}
          className={`task-manager-tab ${activeTab === 'processes' ? 'active' : ''}`}
        >
          Processes
        </button>
        <button
          onClick={() => {
            setActiveTab('performance');
            soundEngine.playClick();
          }}
          className={`task-manager-tab ${activeTab === 'performance' ? 'active' : ''}`}
        >
          Performance
        </button>
      </div>

      <div className="task-manager-content">
        {activeTab === 'processes' ? (
          <div>
            <div className="task-manager-section-title">Apps ({windows.length})</div>

            <table className="task-manager-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="align-right">CPU</th>
                  <th className="align-right">Memory</th>
                  <th className="align-right">Disk</th>
                  <th className="align-right">Network</th>
                </tr>
              </thead>
              <tbody>
                {windows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="task-manager-empty">
                      No foreground apps currently open
                    </td>
                  </tr>
                ) : (
                  windows.map((win) => {
                    const isSelected = selectedWinId === win.id;
                    return (
                      <tr
                        key={win.id}
                        onClick={() => setSelectedWinId(win.id)}
                        className={`task-manager-row ${isSelected ? 'selected' : ''}`}
                      >
                        <td className="task-manager-app-name">
                          <AppIcon appId={win.appId} size={16} />
                          <span className="task-manager-app-title">{win.title}</span>
                        </td>
                        <td className="align-right numeric">
                          {(Math.random() * 3 + 0.5).toFixed(1)}%
                        </td>
                        <td className="align-right numeric">
                          {Math.floor(Math.random() * 120 + 40)} MB
                        </td>
                        <td className="align-right numeric">0.1 MB/s</td>
                        <td className="align-right numeric">0 Mbps</td>
                      </tr>
                    );
                  })
                )}

                <tr className="task-manager-background-title">
                  <td colSpan={5}>Background processes (4)</td>
                </tr>
                <tr className="task-manager-background-row">
                  <td>Desktop Window Manager</td>
                  <td className="align-right numeric">1.2%</td>
                  <td className="align-right numeric">54.2 MB</td>
                  <td className="align-right numeric">0.0 MB/s</td>
                  <td className="align-right numeric">0 Mbps</td>
                </tr>
                <tr className="task-manager-background-row">
                  <td>Windows Audio Device Graph Isolation</td>
                  <td className="align-right numeric">0.4%</td>
                  <td className="align-right numeric">18.6 MB</td>
                  <td className="align-right numeric">0.0 MB/s</td>
                  <td className="align-right numeric">0 Mbps</td>
                </tr>
                <tr className="task-manager-background-row">
                  <td>Antimalware Service Executable</td>
                  <td className="align-right numeric">0.2%</td>
                  <td className="align-right numeric">148.0 MB</td>
                  <td className="align-right numeric">0.3 MB/s</td>
                  <td className="align-right numeric">0 Mbps</td>
                </tr>
                <tr className="task-manager-background-row">
                  <td>Windows Explorer</td>
                  <td className="align-right numeric">0.8%</td>
                  <td className="align-right numeric">82.1 MB</td>
                  <td className="align-right numeric">0.0 MB/s</td>
                  <td className="align-right numeric">0 Mbps</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="task-manager-performance">
            <div className="task-manager-card">
              <div className="task-manager-card-header">
                <div>
                  <div className="task-manager-card-title">CPU</div>
                  <div className="task-manager-card-subtitle">Intel(R) Core(TM) i9-14900K @ 3.20GHz</div>
                </div>
                <div className="task-manager-card-value cpu">
                  <strong>{currentCpu}%</strong>
                  <span>Utilization</span>
                </div>
              </div>

              <div className="task-manager-graph">
                <svg preserveAspectRatio="none" viewBox="0 0 200 100">
                  <line x1="0" y1="25" x2="200" y2="25" stroke="#333" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#333" strokeDasharray="2,2" />
                  <line x1="0" y1="75" x2="200" y2="75" stroke="#333" strokeDasharray="2,2" />
                  <polyline
                    fill="rgba(37, 99, 235, 0.2)"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points={cpuHistory
                      .map((val, idx) => `${(idx / (cpuHistory.length - 1)) * 200},${100 - val}`)
                      .join(' ') + ' 200,100 0,100'}
                  />
                </svg>
              </div>

              <div className="task-manager-cpu-details">
                <div>Speed: <strong>4.12 GHz</strong></div>
                <div>Processes: <strong>142</strong></div>
                <div>Threads: <strong>1,940</strong></div>
                <div>Up time: <strong>0:14:28:10</strong></div>
              </div>
            </div>

            <div className="task-manager-card">
              <div className="task-manager-card-header">
                <div>
                  <div className="task-manager-card-title">Memory</div>
                  <div className="task-manager-card-subtitle">32.0 GB DDR5 6000MHz</div>
                </div>
                <div className="task-manager-card-value memory">
                  <strong>{currentRam} GB</strong>
                  <span>In use (23%)</span>
                </div>
              </div>
              <div className="task-manager-memory-bar">
                <div
                  className="task-manager-memory-used"
                  style={{ width: `${(currentRam / 32) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="task-manager-footer">
        <span className="task-manager-footer-details">Fewer details</span>
        <button
          onClick={handleEndTask}
          disabled={!selectedWinId}
          className="task-manager-end-task"
        >
          End task
        </button>
      </div>
    </div>
  );
};
