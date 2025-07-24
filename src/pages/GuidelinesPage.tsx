import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, Download, ExternalLink, Heart, ChevronRight } from 'lucide-react';
import './GuidelinesPage.css';

interface Guideline {
  id: string;
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
  version: string;
  priority: 'high' | 'medium' | 'low';
  isFavorite: boolean;
  tags: string[];
}

const GuidelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGuideline, setSelectedGuideline] = useState<string | null>(null);

  const guidelines: Guideline[] = [
    {
      id: 'skin-lesions',
      title: 'Skin Lesion Assessment and Referral Criteria',
      category: 'Dermatology',
      description: 'Comprehensive guidelines for assessing suspicious skin lesions and determining appropriate referral pathways.',
      lastUpdated: '2024-01-15',
      version: '3.2',
      priority: 'high',
      isFavorite: true,
      tags: ['melanoma', 'skin cancer', 'urgent referral', 'ABCDE criteria']
    },
    {
      id: 'breast-reconstruction',
      title: 'Post-Mastectomy Breast Reconstruction Guidelines',
      category: 'Breast Surgery',
      description: 'Evidence-based protocols for breast reconstruction following mastectomy procedures.',
      lastUpdated: '2024-01-10',
      version: '2.1',
      priority: 'high',
      isFavorite: false,
      tags: ['breast reconstruction', 'mastectomy', 'oncoplastic']
    },
    {
      id: 'hand-trauma',
      title: 'Hand and Wrist Trauma Management',
      category: 'Hand Surgery',
      description: 'Clinical pathways for assessment and management of hand and wrist injuries.',
      lastUpdated: '2024-01-08',
      version: '1.8',
      priority: 'medium',
      isFavorite: true,
      tags: ['hand trauma', 'fractures', 'tendon injuries']
    },
    {
      id: 'burns-assessment',
      title: 'Burns Assessment and Referral Protocol',
      category: 'Burns',
      description: 'Guidelines for assessing burn severity and determining appropriate treatment pathways.',
      lastUpdated: '2024-01-05',
      version: '2.3',
      priority: 'high',
      isFavorite: false,
      tags: ['burns', 'TBSA', 'emergency referral']
    },
    {
      id: 'facial-trauma',
      title: 'Facial Trauma and Reconstruction',
      category: 'Facial Surgery',
      description: 'Protocols for managing facial trauma and planning reconstructive procedures.',
      lastUpdated: '2023-12-20',
      version: '1.5',
      priority: 'medium',
      isFavorite: false,
      tags: ['facial trauma', 'reconstruction', 'maxillofacial']
    },
    {
      id: 'wound-management',
      title: 'Complex Wound Management Guidelines',
      category: 'Wound Care',
      description: 'Best practices for managing complex wounds and chronic ulcers.',
      lastUpdated: '2023-12-15',
      version: '2.0',
      priority: 'medium',
      isFavorite: true,
      tags: ['wound care', 'chronic wounds', 'ulcers', 'healing']
    }
  ];

  const categories = ['all', 'Dermatology', 'Breast Surgery', 'Hand Surgery', 'Burns', 'Facial Surgery', 'Wound Care'];

  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    // In real app, this would update the backend
    console.log(`Toggle favorite for guideline: ${id}`);
  };

  const getGuidelineContent = (id: string) => {
    const contents: { [key: string]: string } = {
      'skin-lesions': `
        <h3>ABCDE Criteria for Melanoma Detection</h3>
        <ul>
          <li><strong>Asymmetry:</strong> One half of the lesion does not match the other half</li>
          <li><strong>Border:</strong> Irregular, scalloped, or poorly defined borders</li>
          <li><strong>Color:</strong> Varied colors within the same lesion</li>
          <li><strong>Diameter:</strong> Larger than 6mm (pencil eraser size)</li>
          <li><strong>Evolving:</strong> Changes in size, shape, color, or symptoms</li>
        </ul>
        
        <h3>Urgent Referral Criteria (2-week wait)</h3>
        <ul>
          <li>Suspicious pigmented lesion meeting ABCDE criteria</li>
          <li>New pigmented lesion in patients over 50</li>
          <li>Rapidly growing lesion</li>
          <li>Bleeding or ulcerated lesion</li>
          <li>Lesion with irregular pigmentation</li>
        </ul>
        
        <h3>Photography Guidelines</h3>
        <p>When submitting referrals, include:</p>
        <ul>
          <li>Wide-angle photograph showing anatomical location</li>
          <li>Close-up photograph with ruler for scale</li>
          <li>Dermoscopy image if available</li>
        </ul>
      `,
      'breast-reconstruction': `
        <h3>Timing of Reconstruction</h3>
        <ul>
          <li><strong>Immediate:</strong> At the time of mastectomy</li>
          <li><strong>Delayed:</strong> After completion of adjuvant therapy</li>
        </ul>
        
        <h3>Reconstruction Options</h3>
        <ul>
          <li><strong>Implant-based:</strong> Tissue expander followed by permanent implant</li>
          <li><strong>Autologous tissue:</strong> DIEP, TRAM, latissimus dorsi flaps</li>
          <li><strong>Combination:</strong> Implant with autologous tissue coverage</li>
        </ul>
        
        <h3>Patient Selection Criteria</h3>
        <ul>
          <li>Adequate psychological preparation</li>
          <li>Realistic expectations</li>
          <li>Suitable surgical candidate</li>
          <li>Completion of oncological treatment (for delayed reconstruction)</li>
        </ul>
      `
    };
    
    return contents[id] || '<p>Guideline content not available.</p>';
  };

  return (
    <div className="guidelines-page">
      <div className="page-header">
        <h1>Clinical Guidelines</h1>
        <p>Access evidence-based clinical guidelines and best practices for plastic surgery referrals</p>
      </div>

      <div className="guidelines-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search guidelines, conditions, or procedures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <Filter size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="guidelines-content">
        <div className="guidelines-sidebar">
          <div className="quick-access">
            <h3>Quick Access</h3>
            <button className="quick-access-btn">
              <Heart size={16} />
              Emergency Criteria
            </button>
            <button className="quick-access-btn">
              <Star size={16} />
              Favorite Guidelines
            </button>
            <button className="quick-access-btn">
              <Download size={16} />
              Download All
            </button>
          </div>

          <div className="guidelines-list">
            {filteredGuidelines.map(guideline => (
              <div
                key={guideline.id}
                className={`guideline-item ${selectedGuideline === guideline.id ? 'active' : ''}`}
                onClick={() => setSelectedGuideline(guideline.id)}
              >
                <div className="guideline-header">
                  <h4>{guideline.title}</h4>
                  <button 
                    className={`favorite-btn ${guideline.isFavorite ? 'favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(guideline.id);
                    }}
                  >
                    <Star size={16} />
                  </button>
                </div>
                <p className="guideline-description">{guideline.description}</p>
                <div className="guideline-meta">
                  <span className={`priority priority-${guideline.priority}`}>
                    {guideline.priority.toUpperCase()}
                  </span>
                  <span className="category">{guideline.category}</span>
                  <span className="version">v{guideline.version}</span>
                </div>
                <div className="guideline-tags">
                  {guideline.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="guideline-viewer">
          {selectedGuideline ? (
            <div className="guideline-content">
              <div className="guideline-content-header">
                <h2>{guidelines.find(g => g.id === selectedGuideline)?.title}</h2>
                <div className="content-actions">
                  <button className="btn btn-secondary">
                    <Download size={16} />
                    Download PDF
                  </button>
                  <button className="btn btn-secondary">
                    <ExternalLink size={16} />
                    View Full Version
                  </button>
                </div>
              </div>
              
              <div className="guideline-meta-info">
                <div className="meta-item">
                  <strong>Last Updated:</strong> {guidelines.find(g => g.id === selectedGuideline)?.lastUpdated}
                </div>
                <div className="meta-item">
                  <strong>Version:</strong> {guidelines.find(g => g.id === selectedGuideline)?.version}
                </div>
                <div className="meta-item">
                  <strong>Category:</strong> {guidelines.find(g => g.id === selectedGuideline)?.category}
                </div>
              </div>

              <div 
                className="guideline-body"
                dangerouslySetInnerHTML={{ __html: getGuidelineContent(selectedGuideline) }}
              />
              
              <div className="guideline-footer">
                <div className="compliance-note">
                  <p><strong>Note:</strong> These guidelines are based on current Healthcare England protocols and NICE guidance. Always refer to the most recent version available on the Healthcare England website.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <BookOpen size={64} className="no-selection-icon" />
              <h3>Select a Clinical Guideline</h3>
              <p>Choose a guideline from the list to view detailed protocols and best practices.</p>
              
              <div className="featured-guidelines">
                <h4>Featured Guidelines</h4>
                <div className="featured-list">
                  <div className="featured-item" onClick={() => setSelectedGuideline('skin-lesions')}>
                    <ChevronRight size={16} />
                    <span>Skin Lesion Assessment (High Priority)</span>
                  </div>
                  <div className="featured-item" onClick={() => setSelectedGuideline('burns-assessment')}>
                    <ChevronRight size={16} />
                    <span>Burns Assessment Protocol (High Priority)</span>
                  </div>
                  <div className="featured-item" onClick={() => setSelectedGuideline('breast-reconstruction')}>
                    <ChevronRight size={16} />
                    <span>Breast Reconstruction Guidelines</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPage;
