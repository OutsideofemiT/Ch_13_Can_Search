import React, { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';
import { searchGithub, searchGithubUser } from '../api/API';

const CandidateSearch: React.FC = () => {
  // Store the list of basic candidates from the initial API call.
  const [basicCandidates, setBasicCandidates] = useState<any[]>([]);
  // Current index in the basicCandidates array.
  const [currentIndex, setCurrentIndex] = useState(0);
  // Detailed candidate info for the currently displayed candidate.
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  // Fetch basic candidates on mount.
  useEffect(() => {
    const fetchBasicCandidates = async () => {
      try {
        const data = await searchGithub(); // Returns an array of basic user objects.
        setBasicCandidates(data);
      } catch (error) {
        console.error('Error fetching basic candidates:', error);
      }
    };

    fetchBasicCandidates();
  }, []);

  // Fetch detailed data for the candidate at the current index.
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (basicCandidates.length > 0 && currentIndex < basicCandidates.length) {
        const basicCandidate = basicCandidates[currentIndex];
        try {
          const details = await searchGithubUser(basicCandidate.login);
          setCurrentCandidate(details);
        } catch (error) {
          console.error('Error fetching candidate details:', error);
        }
      }
    };

    fetchCandidateDetails();
  }, [basicCandidates, currentIndex]);

  // Move to the next candidate.
  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  // Accept candidate: save detailed candidate data to local storage, then move to next.
  const handleAccept = () => {
    if (currentCandidate) {
      const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]') as Candidate[];
      saved.push(currentCandidate);
      localStorage.setItem('savedCandidates', JSON.stringify(saved));
    }
    handleNext();
  };

  return (
    <div className="candidate-search-container">
      <h1>Candidate Search</h1>
      {currentCandidate ? (
        <div className="candidate-card">
          <img
            className="candidate-avatar"
            src={currentCandidate.avatar_url}
            alt={currentCandidate.login}
          />
          <h2>
            {currentCandidate.name
              ? `${currentCandidate.name} (${currentCandidate.login})`
              : currentCandidate.login}
          </h2>
          <p><strong>Location:</strong> {currentCandidate.location || 'N/A'}</p>
          <p><strong>Email:</strong> {currentCandidate.email || 'N/A'}</p>
          <p><strong>Company:</strong> {currentCandidate.company || 'N/A'}</p>
          <div className="button-group">
            <button className="reject-button" onClick={handleNext}>-</button>
            <button className="accept-button" onClick={handleAccept}>+</button>
          </div>
        </div>
      ) : (
        <p>No more candidates available</p>
      )}
    </div>
  );
};

export default CandidateSearch;