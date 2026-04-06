/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { ScoreCard } from './components/ScoreCard';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { extractTextFromPDF } from './lib/pdf';
import { parseResume, analyzeJobMatch, translateToEnglish, generateCoverLetter } from './lib/gemini';
import { AnalysisResult } from './types';
import { Loader2, Search, Sparkles, FileText, Target, Briefcase, AlertCircle, Languages, FileSignature } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const text = file.type === 'application/pdf' 
        ? await extractTextFromPDF(file)
        : await file.text();
      
      if (!text || text.trim().length < 50) {
        throw new Error("Resume content is too short or could not be parsed. Please check the file.");
      }

      const { parsedResume, atsAnalysis } = await parseResume(text);
      
      let jobMatch;
      if (jobDescription.trim()) {
        jobMatch = await analyzeJobMatch(parsedResume, jobDescription);
      }
      
      setResult({ parsedResume, atsAnalysis, jobMatch });
      setActiveTab('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!jobDescription.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      const translated = await translateToEnglish(jobDescription);
      setJobDescription(translated);
    } catch (err: any) {
      console.error(err);
      setError("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!result || !jobDescription.trim()) return;
    
    setIsGeneratingCL(true);
    setError(null);
    
    try {
      const cl = await generateCoverLetter(result.parsedResume, jobDescription);
      setResult(prev => prev ? { ...prev, coverLetter: cl } : null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate cover letter. Please try again.");
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Rail */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">ATS Master</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'upload' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Upload
          </button>
          <button
            onClick={() => result && setActiveTab('results')}
            disabled={!result}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'results' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900",
              !result && "opacity-50 cursor-not-allowed"
            )}
          >
            Results
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Focus</span>
            <span className="text-sm font-black text-slate-900">Germany / EU</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 max-w-7xl mx-auto px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-7 space-y-12">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter leading-[0.9] text-slate-900">
                    Master the <span className="text-blue-600">ATS</span>.<br />
                    Land the <span className="text-emerald-500">Interview</span>.
                  </h1>
                  <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
                    Strict parsing and scoring optimized for the German job market. 
                    Get professional feedback and actionable changes to reach a 100% match.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-black uppercase tracking-widest text-slate-400">Step 1: Upload Resume</h2>
                    </div>
                    <FileUpload 
                      onFileSelect={setFile} 
                      selectedFile={file} 
                      onClear={handleClear}
                      isLoading={isLoading}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-400">Step 2: Job Details (Optional)</h2>
                      </div>
                      
                      {jobDescription.trim() && (
                        <button
                          onClick={handleTranslate}
                          disabled={isTranslating}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                        >
                          {isTranslating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Languages className="w-3 h-3" />
                          )}
                          Translate to English
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description, technical requirements, and responsibilities here..."
                        className="w-full h-48 p-6 rounded-3xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-300 resize-none text-slate-700 font-medium placeholder:text-slate-300"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Search className="w-3 h-3" />
                        AI Analysis Ready
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!file || isLoading}
                    className={cn(
                      "w-full py-6 rounded-3xl font-black text-xl tracking-tight uppercase transition-all duration-500 flex items-center justify-center gap-3 shadow-xl",
                      !file || isLoading 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95 shadow-blue-200"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Run Deep Analysis
                      </>
                    )}
                  </button>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-bold">{error}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-2xl font-black tracking-tight">Why ATS Master?</h3>
                  
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">Strict Parsing</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          We use advanced AI to simulate real ATS parsers. If we can't read it, they can't either.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">German Market Ready</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Optimized for German recruitment standards, including structure, dates, and detail expectations.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">Role Matching</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Get specific feedback on how to tailor your resume for a specific job description.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-xl shadow-blue-100 overflow-hidden relative">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">Pro Tip</h3>
                    <p className="text-blue-100 leading-relaxed font-medium">
                      In Germany, resumes (Lebenslauf) should be clear, chronological, and usually include a professional photo (though not always required for ATS). Ensure your dates are in MM/YYYY format for best results.
                    </p>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-50" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScoreCard 
                  score={result?.atsAnalysis.overallScore || 0}
                  label="ATS Score"
                  description="Overall compatibility with modern ATS systems."
                  type="ats"
                />
                <ScoreCard 
                  score={result?.atsAnalysis.germanMarketSuitability.score || 0}
                  label="German Suitability"
                  description="Alignment with German recruitment standards."
                  type="german"
                />
                <ScoreCard 
                  score={result?.jobMatch?.matchScore || 0}
                  label="Role Match"
                  description="Compatibility with the provided job description."
                  type="match"
                />
              </div>

              {result && (
                <AnalysisDisplay 
                  data={result} 
                  onGenerateCoverLetter={handleGenerateCoverLetter}
                  isGeneratingCL={isGeneratingCL}
                  hasJD={!!jobDescription.trim()}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-black tracking-tighter uppercase text-slate-400">ATS Master v1.0</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Built for students applying to companies in Germany.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
