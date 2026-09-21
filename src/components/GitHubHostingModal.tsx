import React, { useState } from 'react';
import { X, Github, CheckCircle2, Copy, Sparkles, ExternalLink, Terminal, Globe } from 'lucide-react';

interface GitHubHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubHostingModal: React.FC<GitHubHostingModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const workflowYml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-md">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                100% Kostenlos
              </span>
              <span className="text-xs text-stone-500">GitHub Pages Ready</span>
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              So hosten Sie die Website auf GitHub
            </h3>
          </div>
        </div>

        <p className="text-stone-600 text-sm leading-relaxed">
          Diese Website wurde exakt nach Ihren Vorgaben als leichtgewichtige, performante Single-Page-App
          konzipiert. Die Konfiguration in <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono text-xs">vite.config.ts</code> wurde bereits mit <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono text-xs">base: './'</code> ausgestattet, damit sämtliche Links und Assets auf GitHub Pages sofort funktionieren.
        </p>

        {/* 3 Step Deployment Guide */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1 text-sm">
              <div className="font-bold text-stone-900">Projekt auf GitHub hochladen</div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Klicken Sie oben im Menü von Google AI Studio auf <strong>Settings / Export</strong> und wählen Sie <strong>Export to GitHub</strong> (oder laden Sie den ZIP-Ordner herunter und pushen ihn mit <code className="font-mono text-[11px] bg-stone-200 px-1 py-0.5 rounded">git push</code> in Ihr GitHub-Repository).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1 text-sm">
              <div className="font-bold text-stone-900">GitHub Pages in den Einstellungen aktivieren</div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Öffnen Sie Ihr Repository auf GitHub und navigieren Sie zu <strong>Settings</strong> &gt; <strong>Pages</strong>. Wählen Sie unter <em>Build and deployment</em> entweder <strong>GitHub Actions</strong> oder <strong>Deploy from branch</strong> (z.B. gh-pages oder docs).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1 text-sm">
              <div className="font-bold text-stone-900">Kostenlos weltweit live!</div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Ihre Seite ist nun unter <code className="font-mono text-xs text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">https://ihr-name.github.io/repo-name/</code> weltweit kostenfrei mit SSL-Zertifikat erreichbar. Auf Wunsch können Sie auch eine eigene Domain (z.B. <em>www.stadtfuehrung-leppert.de</em>) in den GitHub-Einstellungen hinterlegen.
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Actions YAML preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-stone-500" />
              <span>Automatische GitHub Action (.github/workflows/deploy.yml):</span>
            </span>
            <button
              onClick={() => copyCode(workflowYml, 1)}
              className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedIndex === 1 ? 'Kopiert!' : 'Workflow kopieren'}</span>
            </button>
          </div>
          <pre className="bg-stone-900 text-stone-200 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 scrollbar-thin">
            {workflowYml}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Verstanden & Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
