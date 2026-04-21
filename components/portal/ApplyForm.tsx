'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { School, University } from '@/types';
import Stepper from '../ui/Stepper';
import SuccessModal from './SuccessModal';

export default function ApplyForm({ 
  university, 
  school, 
  department 
}: { 
  university: University, 
  school: School, 
  department: string 
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const formFields = Array.isArray(school.formFields) ? school.formFields : JSON.parse(school.formFields as any);
  const requirements = Array.isArray(school.schoolRequirements) ? school.schoolRequirements : JSON.parse(school.schoolRequirements as any);

  // Calculate total fees
  const checkedReqs = watch('requirements') || [];
  const baseFee = 25000; // Registration fee
  const totalFee = baseFee + requirements.reduce((acc: number, req: any, idx: number) => {
    return checkedReqs.includes(idx.toString()) ? acc + req.amount : acc;
  }, 0);

  const generatePDF = (formData: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(75, 29, 121); // brand purple
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('AFRIQ University Application', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Reference: AFQ-${Math.floor(Math.random() * 1000000)}`, 105, 20, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Uni Info
    doc.text('Institution Details', 14, 45);
    (doc as any).autoTable({
      startY: 50,
      head: [['Field', 'Value']],
      body: [
        ['University', university.name],
        ['School', school.n],
        ['Department', department]
      ],
      theme: 'grid',
      headStyles: { fillColor: [243, 238, 249], textColor: [75, 29, 121] },
      styles: { fontSize: 10 }
    });
    
    // Personal Info
    const finalY1 = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Applicant Information', 14, finalY1);
    
    const bodyData = Object.keys(formData)
      .filter(k => k !== 'requirements')
      .map(k => {
        const fieldDef = formFields.find((f: any) => f.key === k);
        return [fieldDef ? fieldDef.label : k, formData[k]];
      });
      
    (doc as any).autoTable({
      startY: finalY1 + 5,
      head: [['Field', 'Information']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [243, 238, 249], textColor: [75, 29, 121] },
      styles: { fontSize: 10 }
    });
    
    // Fees
    const finalY2 = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text(`Total Application Fee: ${totalFee} XAF`, 14, finalY2);
    
    doc.save(`${university.short}_${department.substring(0, 10).replace(/ /g, '_')}_Form.pdf`);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const selectedReqs = requirements.filter((_: any, i: number) => data.requirements?.includes(i.toString()));
      
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: school.id,
          personalInfo: data,
          requirementsChecked: selectedReqs,
          totalFee
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');
      
      generatePDF(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stepper 
        steps={[
          { id: '1', label: 'University' },
          { id: '2', label: 'School' },
          { id: '3', label: 'Department' },
          { id: '4', label: 'Apply' }
        ]}
        currentStep="4"
      />

      <div className="max-w-brand-portal mx-auto py-8 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div>
            <div className="mb-7">
              <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b-2 border-brand-border">
                <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">1</div>
                <h3 className="text-[14px] font-extrabold text-brand-slate">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {formFields.map((field: any) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-[11px] font-bold text-brand-mid tracking-[0.3px] uppercase mb-1">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        {...register(field.key, { required: true })}
                        className="w-full text-[13.5px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-lg px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea 
                        {...register(field.key, { required: true })}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full text-[13.5px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-lg px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                      />
                    ) : (
                      <input 
                        type={field.type}
                        {...register(field.key, { required: true })}
                        placeholder={field.placeholder}
                        className="w-full text-[13.5px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-lg px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b-2 border-brand-border">
                <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">2</div>
                <h3 className="text-[14px] font-extrabold text-brand-slate">Required Documents & Fees</h3>
              </div>
              
              <div className="bg-brand-pale border border-brand-border rounded-lg p-3.5 text-[12.5px] text-brand-mid flex items-start gap-2 mb-3.5">
                <svg className="w-5 h-5 shrink-0 text-brand-purple mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Select the requirements you have fulfilled. All fees are compiled into a final bill.
              </div>

              <table className="w-full border-collapse rounded-lg overflow-hidden border-[1.5px] border-brand-border">
                <thead>
                  <tr>
                    <th className="bg-brand-purple text-white text-[10.5px] font-bold tracking-[0.5px] uppercase p-2.5 text-left w-10 text-center">✓</th>
                    <th className="bg-brand-purple text-white text-[10.5px] font-bold tracking-[0.5px] uppercase p-2.5 text-left">Requirement</th>
                    <th className="bg-brand-purple text-white text-[10.5px] font-bold tracking-[0.5px] uppercase p-2.5 text-right w-32">Fee (XAF)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border-b border-brand-border text-center">
                      <input type="checkbox" checked disabled className="w-3.5 h-3.5 accent-brand-purple" />
                    </td>
                    <td className="p-2.5 border-b border-brand-border text-[13px] font-semibold">Concours Registration Fee</td>
                    <td className="p-2.5 border-b border-brand-border text-right">
                      <span className="bg-[#efefef] rounded-[5px] px-2 py-1 text-[11.5px] font-bold text-brand-slate inline-block min-w-[90px]">25,000</span>
                    </td>
                  </tr>
                  {requirements.map((req: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-brand-bg' : ''}>
                      <td className="p-2.5 border-b border-brand-border text-center">
                        <input 
                          type="checkbox" 
                          value={i} 
                          {...register('requirements')} 
                          className="w-3.5 h-3.5 accent-brand-purple cursor-pointer" 
                        />
                      </td>
                      <td className="p-2.5 border-b border-brand-border text-[13px]">{req.label}</td>
                      <td className="p-2.5 border-b border-brand-border text-right">
                        <span className="bg-[#efefef] rounded-[5px] px-2 py-1 text-[11.5px] font-bold text-brand-slate inline-block min-w-[90px]">
                          {req.amount > 0 ? req.amount.toLocaleString() : 'Free'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="bg-brand-pale text-[13px] font-extrabold text-brand-slate p-2.5 border-t-2 border-brand-border text-right">Total Payable:</td>
                    <td className="bg-brand-pale p-2.5 border-t-2 border-brand-border text-right">
                      <span className="bg-brand-gold2/20 text-brand-purple3 rounded-[5px] px-2 py-1 text-[13px] font-extrabold inline-block min-w-[90px]">
                        {totalFee.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="sticky top-[84px]">
            <div className="bg-brand-bg border-[1.5px] border-brand-border rounded-[14px] overflow-hidden mb-3.5">
              <div className="bg-brand-purple px-[17px] py-3 text-white text-[12.5px] font-bold flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Summary
              </div>
              <div className="p-4">
                <div className="flex justify-between py-1.5 border-b border-brand-border text-[12px] last:border-b-0">
                  <span className="text-brand-muted">University</span>
                  <span className="font-bold text-brand-slate max-w-[160px] text-right text-[11.5px] truncate">{university.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border text-[12px] last:border-b-0">
                  <span className="text-brand-muted">School</span>
                  <span className="font-bold text-brand-slate max-w-[160px] text-right text-[11.5px] truncate">{school.n}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border text-[12px] last:border-b-0">
                  <span className="text-brand-muted">Department</span>
                  <span className="font-bold text-brand-slate max-w-[160px] text-right text-[11.5px] truncate">{department}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full text-[14px] font-bold text-white bg-brand-purple border-none p-3.5 rounded-lg hover:bg-brand-purple2 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(75,29,121,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Submit & Generate PDF'}
              {!loading && <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal 
        isOpen={success} 
        onClose={() => { setSuccess(false); router.push('/dashboard'); router.refresh(); }}
        title="Application Submitted!"
        message="Your application has been securely logged and your PDF confirmation has been generated and downloaded. We wish you the best of luck."
      />
    </>
  );
}
