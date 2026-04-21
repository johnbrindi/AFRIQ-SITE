import { create } from 'zustand';

interface PortalState {
  // University selection
  selectedUniversityId: number | null;
  selectedSchoolIndex: number | null;
  selectedDepartmentIndex: number | null;
  
  // Filters (dashboard)
  filterMode: 'all' | 'state' | 'private';
  searchQuery: string;
  
  // Dynamic form
  formValues: Record<string, string>;
  
  // Actions
  setSelectedUniversity: (id: number | null) => void;
  setSelectedSchool: (index: number | null) => void;
  setSelectedDepartment: (index: number | null) => void;
  setFilterMode: (mode: 'all' | 'state' | 'private') => void;
  setSearchQuery: (query: string) => void;
  updateField: (key: string, value: string) => void;
  resetForm: () => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  selectedUniversityId: null,
  selectedSchoolIndex: null,
  selectedDepartmentIndex: null,
  filterMode: 'all',
  searchQuery: '',
  formValues: {},

  setSelectedUniversity: (id) => set({ selectedUniversityId: id, selectedSchoolIndex: null, selectedDepartmentIndex: null, formValues: {} }),
  setSelectedSchool: (index) => set({ selectedSchoolIndex: index, selectedDepartmentIndex: null, formValues: {} }),
  setSelectedDepartment: (index) => set({ selectedDepartmentIndex: index, formValues: {} }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  updateField: (key, value) => set((state) => ({ formValues: { ...state.formValues, [key]: value } })),
  resetForm: () => set({ formValues: {}, selectedDepartmentIndex: null }),
}));
