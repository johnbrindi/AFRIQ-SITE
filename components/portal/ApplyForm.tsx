'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { School, University } from '@/types';
import Stepper from '../ui/Stepper';
import SuccessModal from './SuccessModal';

const REGISTRATION_FEE = 25000;

export default function ApplyForm({ university, school, department }: {
  university: University; school: School; department: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const formFields = Array.isArray(school.formFields)
    ? school.formFields : JSON.parse(school.formFields as any || '[]');
  const requirements = Array.isArray(school.schoolRequirements)
    ? school.schoolRequirements : JSON.parse(school.schoolRequirements as any || '[]');

  // All fees are pre-included — total is fixed
  const totalFee = REGISTRATION_FEE + requirements.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

  const generatePDF = async (formData: any) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const purple: [number, number, number] = [74, 35, 134];
    const lightPurple: [number, number, number] = [243, 238, 249];

    // Header
    doc.setFillColor(...purple);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15); doc.setFont('helvetica', 'bold');
    doc.text('AFRIQ University Application Form', 105, 12, { align: 'center' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`${university.name}  ·  ${school.n}  ·  ${department}`, 105, 20, { align: 'center' });
    const ref = `AFQ-${Date.now().toString(36).toUpperCase()}`;
    doc.text(`Reference: ${ref}  ·  Date: ${new Date().toLocaleDateString('en-GB')}`, 105, 27, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    let y = 42;

    // Section 1 — Student Information
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...purple);
    doc.text('1. Student Information', 14, y); y += 2;
    doc.setTextColor(0, 0, 0);

    const studentRows = formFields.map((f: any) => {
      const val = formData[f.key];
      return [f.label, val !== undefined && val !== '' ? String(val) : '—'];
    });

    autoTable(doc, {
      startY: y + 3,
      head: [['Field', 'Value']],
      body: studentRows,
      theme: 'grid',
      headStyles: { fillColor: lightPurple, textColor: purple, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 65, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Section 2 — Documents & Fees
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...purple);
    doc.text('2. Documents & Fees Required', 14, y); y += 2;
    doc.setTextColor(0, 0, 0);

    const feeRows: [string, string][] = [
      ['Application / Registration Fee', `${REGISTRATION_FEE.toLocaleString()} XAF`],
      ...requirements.map((r: any) => [r.label, `${(r.amount || 0).toLocaleString()} XAF`]),
    ];

    autoTable(doc, {
      startY: y + 3,
      head: [['Document / Requirement', 'Amount (XAF)']],
      body: feeRows,
      theme: 'grid',
      headStyles: { fillColor: lightPurple, textColor: purple, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      foot: [['TOTAL PAYABLE', `${totalFee.toLocaleString()} XAF`]],
      footStyles: { fillColor: purple, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Section 3 — Additional Notes
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.setTextColor(...purple);
    doc.text('3. Additional Notes', 14, y); y += 7;
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const notes = [
      '• All documents must be originals or certified true copies.',
      '• Submit this form together with all listed documents at the AFRIQ office or at the institution.',
      '• Incomplete applications will not be processed.',
      `• Total fees (${totalFee.toLocaleString()} XAF) are payable at the time of submission.`,
      '• Keep a copy of this form and all receipts for your personal records.',
      '• Results will be communicated via the portal and by official post.',
    ];
    notes.forEach(n => { doc.text(n, 14, y); y += 6; });

    // Signature block
    y += 6;
    doc.setDrawColor(...purple); doc.setLineWidth(0.3);
    doc.line(14, y, 90, y); doc.line(120, y, 196, y);
    doc.setFontSize(8); doc.setTextColor(120, 120, 120);
    doc.text("Applicant's Signature & Date", 14, y + 5);
    doc.text("Receiving Officer's Signature & Stamp", 120, y + 5);

    doc.save(`AFRIQ_${school.acr}_${department.replace(/\s+/g, '_')}_Application.pdf`);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: school.id, personalInfo: data, requirementsChecked: requirements, totalFee }),
      });
      if (!res.ok) throw new Error();
      await generatePDF(data);
      setSuccess(true);
    } catch {
      alert('An error occurred while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full text-[13.5px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-lg px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors";
  const labelCls = "block text-[10.5px] font-bold text-brand-mid tracking-[0.4px] uppercase mb-1";

  return (
    <>
      <Stepper steps={[{ id:'1', label:'University' },{ id:'2', label:'School' },{ id:'3', label:'Department' },{ id:'4', label:'Apply' }]} currentStep="4" />

      <div className="max-w-brand-portal mx-auto py-6 sm:py-8 px-3 sm:px-4 md:px-[var(--px)] pb-24 lg:pb-20">
        <form id="apply-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-8 items-start">
          
          {/* LEFT — form sections */}
          <div className="flex flex-col gap-7">

            {/* Section 1: Student Information */}
            <div className="bg-white rounded-xl border-[1.5px] border-brand-border overflow-hidden">
              <div className="bg-brand-pale border-b border-brand-border px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">1</div>
                <h3 className="text-[13.5px] font-extrabold text-brand-slate">Student Information</h3>
              </div>
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {formFields.map((field: any) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className={labelCls}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select {...register(field.key, { required: true })} className={inputCls}>
                        <option value="">Select...</option>
                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'deptSelect' ? (
                      <select {...register(field.key)} className={inputCls}>
                        <option value="">Select department...</option>
                        {(Array.isArray(school.departments) ? school.departments as string[] : JSON.parse(school.departments as any || '[]')).map((d: string) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea {...register(field.key)} placeholder={field.placeholder} rows={3} className={inputCls} />
                    ) : (
                      <input type={field.type} {...register(field.key, { required: true })} placeholder={field.placeholder} className={inputCls} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Documents & Fees — PRE-FILLED */}
            <div className="bg-white rounded-xl border-[1.5px] border-brand-border overflow-hidden">
              <div className="bg-brand-pale border-b border-brand-border px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">2</div>
                <h3 className="text-[13.5px] font-extrabold text-brand-slate">Documents & Fees Required</h3>
              </div>
              <div className="p-4 sm:p-5">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800 flex items-start gap-2 mb-4">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  All documents listed below are <strong>required</strong> for your application. The total fee is automatically calculated.
                </div>
                <div className="overflow-x-auto rounded-lg border border-brand-border -mx-1 sm:mx-0">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand-purple text-white">
                        <th className="text-left p-3 text-[10.5px] font-bold tracking-wider uppercase w-8">✓</th>
                        <th className="text-left p-3 text-[10.5px] font-bold tracking-wider uppercase">Document / Requirement</th>
                        <th className="text-right p-3 text-[10.5px] font-bold tracking-wider uppercase w-32">Fee (XAF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Fixed registration fee row */}
                      <tr className="bg-brand-pale/50">
                        <td className="p-3 text-center"><span className="text-brand-purple font-bold text-base">✓</span></td>
                        <td className="p-3 text-[13px] font-semibold text-brand-slate">Application / Registration Fee</td>
                        <td className="p-3 text-right">
                          <span className="bg-brand-pale text-brand-purple rounded px-2 py-1 text-[12px] font-bold tabular-nums">{REGISTRATION_FEE.toLocaleString()}</span>
                        </td>
                      </tr>
                      {requirements.map((req: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? '' : 'bg-brand-bg/40'}>
                          <td className="p-3 text-center"><span className="text-brand-purple font-bold text-base">✓</span></td>
                          <td className="p-3 text-[13px] text-brand-slate">{req.label}</td>
                          <td className="p-3 text-right">
                            <span className="bg-brand-pale text-brand-purple rounded px-2 py-1 text-[12px] font-bold tabular-nums">
                              {req.amount > 0 ? req.amount.toLocaleString() : 'Free'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-brand-purple text-white">
                        <td colSpan={2} className="p-3 text-[13px] font-extrabold text-right">TOTAL PAYABLE</td>
                        <td className="p-3 text-right">
                          <span className="text-[14px] font-extrabold tabular-nums">{totalFee.toLocaleString()} XAF</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 3: Additional Notes */}
            <div className="bg-white rounded-xl border-[1.5px] border-brand-border overflow-hidden">
              <div className="bg-brand-pale border-b border-brand-border px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">3</div>
                <h3 className="text-[13.5px] font-extrabold text-brand-slate">Additional Notes</h3>
              </div>
              <div className="p-4 sm:p-5">
                <ul className="space-y-2.5 text-[13px] text-brand-mid leading-relaxed">
                  {[
                    'All documents must be originals or certified true copies.',
                    'Submit this form with all listed documents at the AFRIQ office or at the institution registrar.',
                    'Incomplete applications will not be processed.',
                    `Total fees of ${totalFee.toLocaleString()} XAF are payable at the time of submission.`,
                    'Keep a copy of this completed form and all payment receipts for your personal records.',
                    'You will be notified of results via this portal and by official correspondence.',
                  ].map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT — sidebar: stacks below form on mobile, sticky on desktop */}
          <div className="w-full lg:sticky lg:top-[84px]">
            <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-4">
              {/* Solid header — no gradient */}
              <div className="bg-brand-purple px-6 py-4 text-white text-[13px] font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Application Summary
              </div>
              {/* Body — 24px padding */}
              <div className="p-6 space-y-3">
                {[['University', university.name], ['School', school.n], ['Department', department]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-brand-border last:border-0 text-[12px]">
                    <span className="text-brand-muted">{k}</span>
                    <span className="font-bold text-brand-slate text-right max-w-[160px] text-[11.5px] leading-tight">{v}</span>
                  </div>
                ))}
                <div className="pt-3 border-t-2 border-brand-border flex justify-between items-center">
                  <span className="text-[12px] font-bold text-brand-slate">Total Fee</span>
                  <span className="text-[14px] font-extrabold text-brand-purple">{totalFee.toLocaleString()} XAF</span>
                </div>
              </div>
            </div>

            {/* Submit button — desktop only (mobile uses sticky bar below) */}
            <div className="hidden lg:block">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-[14px] font-bold text-white bg-brand-purple py-4 rounded-xl hover:bg-brand-purple2 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating PDF...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Submit &amp; Download PDF</>
                )}
              </button>
              <p className="text-[11px] text-brand-muted text-center mt-3 leading-relaxed">
                Your application is saved securely. A PDF will be downloaded for you to print and submit.
              </p>
            </div>
          </div>

          {/* Mobile sticky submit bar — INSIDE the form so type=submit works with react-hook-form */}
          <div className="fixed bottom-0 left-0 right-0 z-[800] lg:hidden bg-white border-t border-brand-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.10)]">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">Total Payable</div>
              <div className="text-[16px] font-extrabold text-brand-purple leading-tight">{totalFee.toLocaleString()} XAF</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 text-[13px] font-bold text-white bg-brand-purple px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-60 active:bg-brand-purple2 transition-colors"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Submit &amp; PDF</>
              )}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={success}
        onClose={() => { setSuccess(false); router.push('/dashboard'); }}
        title="Application Submitted!"
        message="Your application has been saved and your PDF form has been downloaded. Print it, attach your documents, and submit to the institution."
      />
    </>
  );
}
