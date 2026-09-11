import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Tag, 
  AlertTriangle, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { getKnowledgeBaseDocs, getDocumentContent, searchKnowledgeBase } from '../api';

export default function KnowledgeBaseView({ onSelectDocForChat }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setIsLoading(true);
    try {
      const data = await getKnowledgeBaseDocs();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await searchKnowledgeBase(searchQuery.trim(), 4);
      setSearchResults(res);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDocumentDetails = async (filename) => {
    try {
      const doc = await getDocumentContent(filename);
      setSelectedDoc(doc);
    } catch (err) {
      console.error('Failed to fetch doc content:', err);
    }
  };

  const categories = ['all', ...new Set(documents.map(d => d.category))];

  const filteredDocs = activeCategory === 'all'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* View Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <BookOpen size={24} color="#2563eb" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Academic Regulations & Knowledge Base
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Browse official sample regulations, policies, calendars, and department curricula for ABC Institute of Technology.
        </p>

        {/* Notice Banner */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <AlertTriangle size={18} color="#2563eb" flexShrink={0} />
          <p style={{ fontSize: '0.8rem', color: '#1e40af' }}>
            <strong>Sample Data Notice:</strong> All documents below are illustrative academic regulations for demonstration. Additional institutional documents (.txt/.pdf) can be added directly to the <code>knowledge_base/</code> directory.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '0.5rem 0.85rem'
        }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search regulations (e.g. 'attendance condonation', 'passing marks', 'hall ticket')..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              backgroundColor: 'transparent'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Search RAG
        </button>
        {searchResults && (
          <button
            type="button"
            onClick={() => { setSearchResults(null); setSearchQuery(''); }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffffff',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Clear Search
          </button>
        )}
      </form>

      {/* Semantic Search Results if active */}
      {searchResults && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
            RAG Semantic Matches for "{searchResults.query}" ({searchResults.results.length} results)
          </h3>
          {searchResults.results.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              No confident document matches found above the similarity threshold.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {searchResults.results.map((res, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e3a8a' }}>
                      {res.title} ({res.filename})
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: 600
                    }}>
                      Match Score: {(res.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {res.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.25rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              border: activeCategory === cat ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: activeCategory === cat ? '#2563eb' : '#ffffff',
              color: activeCategory === cat ? '#ffffff' : '#475569',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem'
      }}>
        {filteredDocs.map((doc) => (
          <div
            key={doc.filename}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.15rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#bfdbfe';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  borderRadius: '4px'
                }}>
                  {doc.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {doc.char_count} chars
                </span>
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.4rem' }}>
                {doc.title}
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'monospace' }}>
                {doc.filename}
              </p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => viewDocumentDetails(doc.filename)}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1e40af',
                  cursor: 'pointer'
                }}
              >
                Read Document
              </button>
              {onSelectDocForChat && (
                <button
                  onClick={() => onSelectDocForChat(`Explain the regulations in ${doc.title}`)}
                  style={{
                    padding: '0.45rem 0.65rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: '#2563eb',
                    cursor: 'pointer'
                  }}
                  title="Ask assistant about this"
                >
                  Ask AI
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Document Reader Modal */}
      {selectedDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedDoc.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                  {selectedDoc.filename} • {selectedDoc.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: '#334155'
              }}>
                {selectedDoc.content}
              </pre>
            </div>
            <div style={{
              padding: '0.75rem 1.5rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  padding: '0.45rem 1.25rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
