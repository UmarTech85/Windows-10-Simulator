import React, { useState, useRef } from 'react';
import {
  FolderPlus,
  FilePlus,
  RefreshCw,
  Monitor,
  Palette,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { FileItem, AppId } from '../../types/os';
import { AppIcon } from '../common/AppIcon';
import { soundEngine } from '../../utils/sound';

interface DesktopProps {
  wallpaper: string;
  files: FileItem[];
  selectedIconId: string | null;
  onSelectIcon: (id: string | null) => void;
  onOpenApp: (appId: AppId) => void;
  onOpenFile: (file: FileItem) => void;
  onCreateFolder: (name: string, location: FileItem['location']) => void;
  onCreateFile: (name: string, content: string, location: FileItem['location']) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

export const Desktop: React.FC<DesktopProps> = ({
  wallpaper,
  files,
  selectedIconId,
  onSelectIcon,
  onOpenApp,
  onOpenFile,
  onCreateFolder,
  onCreateFile,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, visible: false });
  const [iconSize, setIconSize] = useState<'normal' | 'small' | 'large'>('normal');

  // Rubber-band marquee selection
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    active: boolean;
  }>({ startX: 0, startY: 0, currentX: 0, currentY: 0, active: false });

  const desktopRef = useRef<HTMLDivElement>(null);

  const systemShortcuts: { id: string; title: string; appId: AppId; icon: string }[] = [
    { id: 'sc-thispc', title: 'This PC', appId: 'explorer', icon: 'explorer' },
    { id: 'sc-recycle', title: 'Recycle Bin', appId: 'recyclebin', icon: 'recyclebin' },
    { id: 'sc-edge', title: 'Microsoft Edge', appId: 'edge', icon: 'edge' },
  ];

  const desktopFiles = files.filter((f) => f.location === 'desktop' && !f.isRecycled);
  const recycledCount = files.filter((f) => f.isRecycled).length;

  const quickActions = [
    { id: 'desktop-thispc', label: 'This PC', appId: 'explorer' as AppId },
    { id: 'desktop-settings', label: 'Settings', appId: 'settings' as AppId },
    { id: 'desktop-files', label: 'Docs', appId: 'explorer' as AppId },
    { id: 'desktop-recycle', label: 'Recycle', appId: 'recyclebin' as AppId },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 200),
      y: Math.min(e.clientY, window.innerHeight - 240),
      visible: true,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }

    if (e.button === 0 && e.target === desktopRef.current) {
      onSelectIcon(null);
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        active: true,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionBox.active) {
      setSelectionBox((prev) => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    }
  };

  const handleMouseUp = () => {
    if (selectionBox.active) {
      setSelectionBox((prev) => ({ ...prev, active: false }));
    }
  };

  const iconDimClass =
    iconSize === 'small'
      ? 'w-18 h-18 text-[11px]'
      : iconSize === 'large'
      ? 'w-24 h-24 text-xs'
      : 'w-20 h-20 text-xs';

  const iconGraphicSize = iconSize === 'small' ? 28 : iconSize === 'large' ? 44 : 36;

  const boxLeft = Math.min(selectionBox.startX, selectionBox.currentX);
  const boxTop = Math.min(selectionBox.startY, selectionBox.currentY);
  const boxWidth = Math.abs(selectionBox.currentX - selectionBox.startX);
  const boxHeight = Math.abs(selectionBox.currentY - selectionBox.startY);

  return (
    <div
      ref={desktopRef}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0 bottom-[44px] bg-cover bg-center select-none font-sans overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute left-4 top-4 z-20 glass-panel rounded-xl px-3 py-2 desktop-dock">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-200">System Ready</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
          <Sparkles size={14} className="text-blue-300" />
          <span>Desktop mode • Fast access</span>
        </div>
      </div>

      {selectionBox.active && (
        <div
          className="fixed border border-blue-400 bg-blue-500/25 pointer-events-none z-30"
          style={{
            left: `${boxLeft}px`,
            top: `${boxTop}px`,
            width: `${boxWidth}px`,
            height: `${boxHeight}px`,
          }}
        />
      )}

      <div className="absolute right-4 top-4 z-20 glass-panel rounded-xl p-3 min-w-[230px]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-300">Quick access</div>
          <div className="rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-100">
            Live
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                if (action.appId === 'recyclebin') {
                  onOpenApp('recyclebin');
                  return;
                }
                onOpenApp(action.appId);
              }}
              className="quick-action-btn"
            >
              <AppIcon appId={action.appId} size={18} />
              <span className="text-[11px] font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 flex flex-col flex-wrap gap-2 max-h-full items-start content-start z-10 relative pt-24 pr-40">
        {systemShortcuts.map((sc) => {
          const isSelected = selectedIconId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectIcon(sc.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onOpenApp(sc.appId);
              }}
              className={`${iconDimClass} flex flex-col items-center justify-center p-1.5 rounded cursor-pointer transition-colors border group ${
                isSelected
                  ? 'bg-blue-600/35 border-blue-400/80 shadow-xs'
                  : 'border-transparent hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <AppIcon
                  appId={sc.icon}
                  size={iconGraphicSize}
                  isEmptyRecycleBin={sc.appId === 'recyclebin' && recycledCount === 0}
                />
              </div>
              <span className="text-white text-center truncate max-w-full font-normal leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {sc.title}
              </span>
            </div>
          );
        })}

        {desktopFiles.map((file) => {
          const isSelected = selectedIconId === file.id;
          return (
            <div
              key={file.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectIcon(file.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onOpenFile(file);
              }}
              className={`${iconDimClass} flex flex-col items-center justify-center p-1.5 rounded cursor-pointer transition-colors border group ${
                isSelected
                  ? 'bg-blue-600/35 border-blue-400/80 shadow-xs'
                  : 'border-transparent hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                {file.type === 'folder' ? (
                  <AppIcon name="folder" size={iconGraphicSize} />
                ) : file.extension === 'jpg' || file.extension === 'png' ? (
                  file.content?.startsWith('/src/assets') || file.content?.startsWith('data:') ? (
                    <img
                      src={file.content}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-cover rounded shadow-md border border-white/40"
                    />
                  ) : (
                    <AppIcon appId="photos" size={iconGraphicSize} />
                  )
                ) : (
                  <AppIcon appId={file.extension} size={iconGraphicSize} />
                )}
              </div>
              <span className="text-white text-center truncate max-w-full font-normal leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {file.name}
              </span>
            </div>
          );
        })}
      </div>

      {contextMenu.visible && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bg-white/95 backdrop-blur-xl border border-zinc-300 shadow-xl rounded-sm py-1 z-50 text-xs text-zinc-800 w-48 font-sans animate-fadeIn select-none"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            onClick={() => {
              setIconSize(iconSize === 'normal' ? 'large' : iconSize === 'large' ? 'small' : 'normal');
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid size={14} className="text-zinc-500" />
              <span>Icon size: {iconSize}</span>
            </div>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center gap-2"
          >
            <RefreshCw size={14} className="text-zinc-500" />
            <span>Refresh</span>
          </button>

          <div className="border-t border-zinc-200 my-1" />

          <button
            onClick={() => {
              onCreateFolder('New folder', 'desktop');
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center gap-2"
          >
            <FolderPlus size={14} className="text-amber-500" />
            <span>New folder</span>
          </button>

          <button
            onClick={() => {
              onCreateFile('New Text Document.txt', '', 'desktop');
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center gap-2"
          >
            <FilePlus size={14} className="text-blue-500" />
            <span>New text document</span>
          </button>

          <div className="border-t border-zinc-200 my-1" />

          <button
            onClick={() => {
              onOpenApp('settings');
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center gap-2"
          >
            <Monitor size={14} className="text-zinc-500" />
            <span>Display settings</span>
          </button>

          <button
            onClick={() => {
              onOpenApp('settings');
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 flex items-center gap-2"
          >
            <Palette size={14} className="text-purple-500" />
            <span>Personalize</span>
          </button>
        </div>
      )}
    </div>
  );
};



























































