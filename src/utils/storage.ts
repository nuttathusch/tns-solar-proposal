import type { ProposalProject } from '../types/proposal';
import { createInitialProposal } from '../data/presets';

const STORAGE_KEY = 'tns_solar_proposals_v1';
const CURRENT_ACTIVE_KEY = 'tns_current_proposal_id';

export function getSavedProposals(): ProposalProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load proposals from storage', err);
    return [];
  }
}

export function saveProposal(proposal: ProposalProject): void {
  try {
    const list = getSavedProposals();
    const index = list.findIndex(p => p.id === proposal.id);
    proposal.lastModified = Date.now();
    
    if (index >= 0) {
      list[index] = proposal;
    } else {
      list.unshift(proposal);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(CURRENT_ACTIVE_KEY, proposal.id);
  } catch (err) {
    console.error('Failed to save proposal to storage', err);
  }
}

export function loadCurrentProposal(): ProposalProject {
  try {
    const currentId = localStorage.getItem(CURRENT_ACTIVE_KEY);
    const list = getSavedProposals();
    if (currentId) {
      const found = list.find(p => p.id === currentId);
      if (found) return found;
    }
    if (list.length > 0) return list[0];
  } catch (err) {
    console.error('Failed to load current proposal', err);
  }
  return createInitialProposal();
}

export function deleteProposal(id: string): void {
  try {
    const list = getSavedProposals().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to delete proposal', err);
  }
}

export function exportProposalAsJson(proposal: ProposalProject): void {
  const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TNS_Solar_Proposal_${proposal.customer.name.replace(/\s+/g, '_')}_${proposal.quotationNumber}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
