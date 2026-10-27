import React, { useState } from 'react';
import { Bike, Car, Navigation, Footprints, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { VehicleType, VEHICLE_EMISSION_FACTORS } from '../types';

interface TripReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedVehicle: VehicleType) => void;
}

export const TripReplacementModal: React.FC<TripReplacementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<VehicleType>('motorcycle');

  if (!isOpen) return null;

  const vehicleOptions: { type: VehicleType; label: string; icon: React.ReactNode; factor: number; desc: string }[] = [
    {
      type: 'motorcycle',
      label: 'Motorcycle / Scooter',
      icon: <Bike className="w-5 h-5" />,
      factor: VEHICLE_EMISSION_FACTORS.motorcycle.factor,
      desc: 'Common 100-150cc commuter two-wheeler',
    },
    {
      type: 'car',
      label: 'Private Car / Cab',
      icon: <Car className="w-5 h-5" />,
      factor: VEHICLE_EMISSION_FACTORS.car.factor,
      desc: 'Typical city petrol/diesel passenger vehicle',
    },
    {
      type: 'auto_rickshaw',
      label: 'Auto-rickshaw',
      icon: <Navigation className="w-5 h-5" />,
      factor: VEHICLE_EMISSION_FACTORS.auto_rickshaw.factor,
      desc: 'Urban 3-wheeler shared or hired transit',
    },
    {
      type: 'walking',
      label: 'Already Walking',
      icon: <Footprints className="w-5 h-5" />,
      factor: VEHICLE_EMISSION_FACTORS.walking.factor,
      desc: 'Pedestrian habit baseline (no motor offset)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Sustainable Urban Mobility</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How would you normally travel this route?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            By choosing to walk instead of taking a motorized trip, you actively prevent tailpipe emissions and traffic congestion in your neighborhood.
          </p>
        </div>

        {/* Vehicle Options */}
        <div className="space-y-2.5 mb-6">
          {vehicleOptions.map((opt) => {
            const isSelected = selected === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelected(opt.type)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-mono font-medium text-emerald-700">
                    {opt.factor > 0 ? `~${opt.factor.toFixed(2)} kg/km` : '0 kg/km'}
                  </span>
                  <div className="text-[10px] text-slate-400">CO₂ factor</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Academic Note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-6 flex items-start gap-2.5 text-xs text-slate-600">
          <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Methodology note:</strong> Emission factors are illustrative academic averages used for ecological impact estimation and gamification.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Confirm & Start Walk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
