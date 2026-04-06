import React from 'react';
import { motion } from 'motion/react';
import { ParsedResume, ATSAnalysis, JobMatchAnalysis } from '../types';
import { CheckCircle2, AlertCircle, Info, User, Briefcase, GraduationCap, Code, FolderGit2, ArrowRight, Lightbulb, Target, FileSignature, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalysisDisplayProps {
  data: {
    parsedResume: ParsedResume;
    atsAnalysis: ATSAnalysis;
    jobMatch?: JobMatchAnalysis;
    coverLetter?: string;
  };
  onGenerateCoverLetter?: () => void;
  isGeneratingCL?: boolean;
  hasJD?: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data, onGenerateCoverLetter, isGeneratingCL, hasJD }) => {
  const { parsedResume, atsAnalysis, jobMatch } = data;

  const SectionHeader = ({ icon: Icon, title, color = "blue" }: { icon: any, title: string, color?: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={cn("p-2 rounded-xl bg-white shadow-sm border", `text-${color}-600 border-${color}-100`)}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
  );

  const Badge = ({ children, color = "slate", className }: { children: React.ReactNode, color?: string, className?: string }) => (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border",
      color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
      color === "rose" ? "bg-rose-50 text-rose-700 border-rose-100" :
      color === "amber" ? "bg-amber-50 text-amber-700 border-amber-100" :
      color === "blue" ? "bg-blue-50 text-blue-700 border-blue-100" :
      "bg-slate-50 text-slate-700 border-slate-100",
      className
    )}>
      {children}
    </span>
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <SectionHeader icon={Info} title="ATS Analysis Summary" />
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Parsing Rate</span>
              <Badge color={atsAnalysis.parsingRate >= 90 ? "emerald" : "amber"}>
                {atsAnalysis.parsingRate}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">ATS Friendly</span>
              <Badge color={atsAnalysis.isAtsFriendly ? "emerald" : "rose"}>
                {atsAnalysis.isAtsFriendly ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">German Market Suitability</span>
              <Badge color={atsAnalysis.germanMarketSuitability.score >= 80 ? "emerald" : "amber"}>
                {atsAnalysis.germanMarketSuitability.score}%
              </Badge>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <SectionHeader icon={Lightbulb} title="Key Recommendations" color="amber" />
          <ul className="space-y-4">
            {atsAnalysis.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed group">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                </div>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Job Match Analysis */}
      {jobMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className={cn(
              "px-4 py-2 rounded-2xl font-black text-2xl tracking-tighter shadow-sm border",
              jobMatch.chancesOfCall === "High" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              jobMatch.chancesOfCall === "Medium" ? "bg-blue-50 text-blue-600 border-blue-100" :
              "bg-rose-50 text-rose-600 border-rose-100"
            )}>
              {jobMatch.chancesOfCall} Chance
            </div>
          </div>
          
          <SectionHeader icon={Target} title="Job Match Analysis" color="emerald" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Missing Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobMatch.missingTechnicalSkills.map((skill, i) => (
                  <Badge key={i} color="rose">{skill}</Badge>
                ))}
                {jobMatch.missingTechnicalSkills.length === 0 && <p className="text-sm text-slate-400 italic">None identified</p>}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Missing Responsibilities</h4>
              <ul className="space-y-3">
                {jobMatch.missingResponsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    {resp}
                  </li>
                ))}
                {jobMatch.missingResponsibilities.length === 0 && <p className="text-sm text-slate-400 italic">None identified</p>}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Actionable Changes for 100% Match</h4>
              <ul className="space-y-3">
                {jobMatch.actionableChanges.map((change, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Overall Feedback</h4>
            <p className="text-slate-600 leading-relaxed">{jobMatch.feedback}</p>
          </div>
        </motion.div>
      )}

      {/* Cover Letter Section */}
      {!data.coverLetter && hasJD && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <SectionHeader icon={FileSignature} title="Step 3: Cover Letter (Optional)" color="indigo" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="space-y-1">
              <h4 className="font-black text-slate-900 tracking-tight">Generate a Tailored Cover Letter</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Our AI will analyze your resume and the job description to write a professional cover letter optimized for this specific role.
              </p>
            </div>
            <button
              onClick={onGenerateCoverLetter}
              disabled={isGeneratingCL}
              className={cn(
                "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2 flex-shrink-0 shadow-lg",
                isGeneratingCL 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-indigo-100"
              )}
            >
              {isGeneratingCL ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Now
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {data.coverLetter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <SectionHeader icon={FileSignature} title="Tailored Cover Letter" color="indigo" />
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
            {data.coverLetter}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.coverLetter || "");
              }}
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Copy to Clipboard
            </button>
          </div>
        </motion.div>
      )}

      {/* Parsed Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <SectionHeader icon={Briefcase} title="Professional Experience" color="blue" />
          <div className="space-y-8">
            {parsedResume.experience.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-slate-100 group">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500 group-hover:scale-125 transition-transform" />
                <div className="mb-2">
                  <h4 className="font-black text-slate-900 tracking-tight">{exp.role}</h4>
                  <p className="text-sm font-bold text-blue-600">{exp.company}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {exp.startDate} — {exp.endDate} | {exp.location}
                  </p>
                </div>
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, j) => (
                    <li key={j} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education & Projects */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <SectionHeader icon={GraduationCap} title="Education" color="indigo" />
            <div className="space-y-6">
              {parsedResume.education.map((edu, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tight">{edu.degree}</h4>
                    <p className="text-sm font-bold text-slate-600">{edu.institution}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                      {edu.startDate} — {edu.endDate} | {edu.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <SectionHeader icon={FolderGit2} title="Projects" color="emerald" />
            <div className="space-y-6">
              {parsedResume.projects.map((proj, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                  <h4 className="font-black text-slate-900 tracking-tight mb-2">{proj.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map((tech, j) => (
                      <Badge key={j} color="emerald">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <SectionHeader icon={Code} title="Skills" color="purple" />
            <div className="flex flex-wrap gap-2">
              {parsedResume.skills.map((skill, i) => (
                <Badge key={i} color="blue">{skill}</Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
