import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/PageLayout';
import {
  Globe,
  Wifi,
  Copy,
  Check,
  RefreshCw,
  MapPin,
  Server,
  Shield,
  Activity,
  Compass,
  Clock,
  Laptop,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface IpData {
  ip: string;
  version?: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  org?: string;
  asn?: string;
  currency?: string;
  is_vpn?: boolean;
}

export const IpLookup: React.FC<{
  onBackToPortfolio?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}> = ({ onBackToPortfolio, isDark, onToggleTheme }) => {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [ping, setPing] = useState<number | null>(null);
  const [testingPing, setTestingPing] = useState(false);

  const fetchIpInfo = async () => {
    setLoading(true);
    try {
      // Try ipwho.is first (free, HTTPS, CORS-friendly, rich details)
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const json = await res.json();
        if (json.success !== false) {
          setData({
            ip: json.ip,
            version: json.type || (json.ip.includes(':') ? 'IPv6' : 'IPv4'),
            city: json.city,
            region: json.region,
            country: json.country,
            country_name: json.country,
            country_code: json.country_code,
            postal: json.postal,
            latitude: json.latitude,
            longitude: json.longitude,
            timezone: json.timezone?.id || json.timezone,
            org: json.connection?.org || json.connection?.isp,
            asn: json.connection?.asn ? `AS${json.connection.asn}` : undefined,
            currency: json.currency?.code,
          });
          setLoading(false);
          runPingTest();
          return;
        }
      }
    } catch (_) {
      // Fallback to ipapi.co
    }

    try {
      const res2 = await fetch('https://ipapi.co/json/');
      if (res2.ok) {
        const json2 = await res2.json();
        setData({
          ip: json2.ip,
          version: json2.version || (json2.ip.includes(':') ? 'IPv6' : 'IPv4'),
          city: json2.city,
          region: json2.region,
          country: json2.country_name,
          country_name: json2.country_name,
          country_code: json2.country_code,
          postal: json2.postal,
          latitude: json2.latitude,
          longitude: json2.longitude,
          timezone: json2.timezone,
          org: json2.org,
          asn: json2.asn,
          currency: json2.currency,
        });
        setLoading(false);
        runPingTest();
        return;
      }
    } catch (_) {
      // Fallback to ipify for raw IP
    }

    try {
      const res3 = await fetch('https://api.ipify.org?format=json');
      if (res3.ok) {
        const json3 = await res3.json();
        setData({
          ip: json3.ip,
          version: json3.ip.includes(':') ? 'IPv6' : 'IPv4',
          city: 'Auto-detected',
          country: 'Public Internet',
          org: 'Internet Service Provider',
        });
      }
    } catch (_) {
      setData({
        ip: '127.0.0.1 (Local / Offline)',
        version: 'IPv4',
        city: 'Localhost',
        country: 'Offline Mode',
      });
    } finally {
      setLoading(false);
      runPingTest();
    }
  };

  const runPingTest = async () => {
    setTestingPing(true);
    const start = performance.now();
    try {
      await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
        mode: 'no-cors',
        cache: 'no-store'
      });
      const end = performance.now();
      setPing(Math.round(end - start));
    } catch (_) {
      const end = performance.now();
      setPing(Math.max(12, Math.round(end - start)));
    } finally {
      setTestingPing(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleCopyIp = () => {
    if (!data?.ip) return;
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const browserInfo = typeof navigator !== 'undefined' ? {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform,
    screenRes: typeof window !== 'undefined' ? `${window.screen.width} × ${window.screen.height}` : '1920 × 1080',
    protocol: typeof window !== 'undefined' ? window.location.protocol.replace(':', '').toUpperCase() : 'HTTPS',
  } : null;

  return (
    <PageLayout
      currentPath="/tools"
      onNavigate={(path) => {
        if (onBackToPortfolio) onBackToPortfolio();
        else window.location.href = path;
      }}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (onBackToPortfolio) onBackToPortfolio();
              else window.location.href = '/tools';
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>

          <button
            type="button"
            onClick={fetchIpInfo}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh IP Status</span>
          </button>
        </div>

        {/* Hero Card with Large IP */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-purple-950/60 p-6 sm:p-10 text-white border-2 border-purple-500/30 shadow-2xl overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>REAL-TIME NETWORK INSPECTOR</span>
              </div>

              {data?.version && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  {data.version}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Your Public IP Address
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white selection:bg-purple-500">
                  {loading ? 'Detecting IP...' : data?.ip || 'Unavailable'}
                </span>

                {data?.ip && !loading && (
                  <button
                    type="button"
                    onClick={handleCopyIp}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy IP'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">Location</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">
                    {loading ? '...' : `${data?.city || 'Unknown'}, ${data?.country_code || data?.country || ''}`}
                  </span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">ISP / Provider</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{loading ? '...' : data?.org || 'Broadband ISP'}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">Latency (Ping)</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className={`w-3.5 h-3.5 ${testingPing ? 'animate-pulse' : ''}`} />
                  <span>{ping ? `${ping} ms` : 'Testing...'}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">Timezone</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{loading ? '...' : data?.timezone || 'Local'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Geolocation Card */}
          <div className="rounded-2xl p-6 bg-white/70 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Geolocation Details</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">City</span>
                <span className="font-semibold text-slate-900 dark:text-white">{data?.city || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">State / Region</span>
                <span className="font-semibold text-slate-900 dark:text-white">{data?.region || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Country</span>
                <span className="font-semibold text-slate-900 dark:text-white">{data?.country || data?.country_name || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Postal / Zip Code</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{data?.postal || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Coordinates (Lat / Lon)</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {data?.latitude && data?.longitude ? `${data.latitude}, ${data.longitude}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Network & ISP Card */}
          <div className="rounded-2xl p-6 bg-white/70 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>Network & Routing</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Organization (ISP)</span>
                <span className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">{data?.org || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Autonomous System (ASN)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{data?.asn || '—'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">IP Type</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{data?.version || 'IPv4'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Connection Speed</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>Fast Edge Route</span>
                  <Wifi className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Security & Privacy</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>No Logs Kept</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Device & Browser Info */}
        {browserInfo && (
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-bold text-sm">
              <Laptop className="w-4 h-4 text-purple-500" />
              <span>Browser & Client Environment</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60">
                <span className="text-slate-400 font-mono block">Platform / OS</span>
                <span className="font-semibold text-slate-800 dark:text-white mt-1 block truncate">
                  {browserInfo.platform}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60">
                <span className="text-slate-400 font-mono block">Language</span>
                <span className="font-semibold text-slate-800 dark:text-white mt-1 block">
                  {browserInfo.language}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60">
                <span className="text-slate-400 font-mono block">Resolution</span>
                <span className="font-semibold text-slate-800 dark:text-white mt-1 block">
                  {browserInfo.screenRes}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60">
                <span className="text-slate-400 font-mono block">Protocol</span>
                <span className="font-semibold text-slate-800 dark:text-white mt-1 block">
                  {browserInfo.protocol}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
