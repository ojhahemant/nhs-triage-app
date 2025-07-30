import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Download,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './OpList.css';

interface OpListEntry {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  chiNumber: string;
  consultant: string;
  procedure: string;
  location: string;
  appointmentType: string;
  timeSlot: string;
  date: Date;
  urgency: 'urgent' | 'routine' | 'non-priority';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed';
}

interface OpListProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const OpList: React.FC<OpListProps> = ({ isExpanded, onToggle }) => {
  const [opListEntries, setOpListEntries] = useState<OpListEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2025-08-01'); // Set to date with dummy data
  const [filterConsultant, setFilterConsultant] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading Op List data
    const loadOpListData = () => {
      const mockData: OpListEntry[] = [
        // August 1, 2025 - Morning List
        {
          id: 'OP001',
          patientName: 'Mr John MacLeod',
          age: 75,
          gender: 'M',
          chiNumber: 'CHI 1638786781',
          consultant: 'Mr DAVIDSON',
          procedure: 'Lesion excision - right cheek',
          location: 'LA',
          appointmentType: 'See and Treat',
          timeSlot: '7:30 AM',
          date: new Date('2025-08-01'),
          urgency: 'urgent',
          status: 'scheduled'
        },
        {
          id: 'OP002',
          patientName: 'Ms Jennifer MacDonald',
          age: 82,
          gender: 'F',
          chiNumber: 'CHI 137238972',
          consultant: 'Mr THOMSON',
          procedure: 'Scalp lesion biopsy',
          location: 'LA',
          appointmentType: 'See and treat',
          timeSlot: '7:30 AM',
          date: new Date('2025-08-01'),
          urgency: 'routine',
          status: 'confirmed'
        },
        {
          id: 'OP003',
          patientName: 'Mr David Robertson',
          age: 84,
          gender: 'M',
          chiNumber: 'CHI 284739102',
          consultant: 'Mr STEWART',
          procedure: 'Nasal lesion excision',
          location: 'LA',
          appointmentType: 'See and treat',
          timeSlot: '8:00 AM',
          date: new Date('2025-08-01'),
          urgency: 'urgent',
          status: 'confirmed'
        },
        {
          id: 'OP004',
          patientName: 'Ms Karen Hamilton',
          age: 79,
          gender: 'F',
          chiNumber: 'CHI 847392847',
          consultant: 'Mr FRASER',
          procedure: 'Upper lip lesion excision',
          location: 'LA',
          appointmentType: 'See and treat',
          timeSlot: '8:30 AM',
          date: new Date('2025-08-01'),
          urgency: 'routine',
          status: 'scheduled'
        },
        {
          id: 'OP005',
          patientName: 'Mr William Campbell',
          age: 67,
          gender: 'M',
          chiNumber: 'CHI 938471829',
          consultant: 'Mr DAVIDSON',
          procedure: 'Facial reconstruction consultation',
          location: 'Theatre 2',
          appointmentType: 'Surgical Assessment',
          timeSlot: '9:00 AM',
          date: new Date('2025-08-01'),
          urgency: 'urgent',
          status: 'confirmed'
        },
        {
          id: 'OP006',
          patientName: 'Ms Sarah Anderson',
          age: 45,
          gender: 'F',
          chiNumber: 'CHI 473829174',
          consultant: 'Mr THOMSON',
          procedure: 'Shoulder mole removal',
          location: 'LA',
          appointmentType: 'Minor Surgery',
          timeSlot: '9:30 AM',
          date: new Date('2025-08-01'),
          urgency: 'non-priority',
          status: 'scheduled'
        },
        {
          id: 'OP007',
          patientName: 'Mr Robert McKenzie',
          age: 58,
          gender: 'M',
          chiNumber: 'CHI 582947301',
          consultant: 'Mr STEWART',
          procedure: 'Ear reconstruction - trauma',
          location: 'Theatre 1',
          appointmentType: 'Major Surgery',
          timeSlot: '10:00 AM',
          date: new Date('2025-08-01'),
          urgency: 'urgent',
          status: 'confirmed'
        },
        {
          id: 'OP008',
          patientName: 'Ms Fiona Stewart',
          age: 63,
          gender: 'F',
          chiNumber: 'CHI 394857201',
          consultant: 'Mr FRASER',
          procedure: 'Hand surgery - contracture release',
          location: 'Theatre 3',
          appointmentType: 'Surgery',
          timeSlot: '11:00 AM',
          date: new Date('2025-08-01'),
          urgency: 'routine',
          status: 'scheduled'
        },

        // August 2, 2025 - Friday List
        {
          id: 'OP009',
          patientName: 'Mr James Morrison',
          age: 71,
          gender: 'M',
          chiNumber: 'CHI 591827364',
          consultant: 'Mr DAVIDSON',
          procedure: 'Basal cell carcinoma excision - forehead',
          location: 'LA',
          appointmentType: 'See and Treat',
          timeSlot: '8:00 AM',
          date: new Date('2025-08-02'),
          urgency: 'urgent',
          status: 'scheduled'
        },
        {
          id: 'OP010',
          patientName: 'Ms Margaret Wilson',
          age: 88,
          gender: 'F',
          chiNumber: 'CHI 472859103',
          consultant: 'Mr THOMSON',
          procedure: 'Squamous cell carcinoma - hand',
          location: 'LA',
          appointmentType: 'See and treat',
          timeSlot: '8:30 AM',
          date: new Date('2025-08-02'),
          urgency: 'urgent',
          status: 'confirmed'
        },
        {
          id: 'OP011',
          patientName: 'Mr Andrew Fraser',
          age: 52,
          gender: 'M',
          chiNumber: 'CHI 628394751',
          consultant: 'Mr STEWART',
          procedure: 'Breast reconstruction - delayed',
          location: 'Theatre 1',
          appointmentType: 'Major Surgery',
          timeSlot: '9:00 AM',
          date: new Date('2025-08-02'),
          urgency: 'routine',
          status: 'confirmed'
        },
        {
          id: 'OP012',
          patientName: 'Ms Claire Douglas',
          age: 34,
          gender: 'F',
          chiNumber: 'CHI 847392018',
          consultant: 'Mr FRASER',
          procedure: 'Rhinoplasty - functional',
          location: 'Theatre 2',
          appointmentType: 'Surgery',
          timeSlot: '10:30 AM',
          date: new Date('2025-08-02'),
          urgency: 'routine',
          status: 'scheduled'
        },

        // August 5, 2025 - Monday List
        {
          id: 'OP013',
          patientName: 'Mr Gordon Murray',
          age: 69,
          gender: 'M',
          chiNumber: 'CHI 739485201',
          consultant: 'Mr DAVIDSON',
          procedure: 'Melanoma excision - back',
          location: 'Theatre 1',
          appointmentType: 'Major Surgery',
          timeSlot: '7:30 AM',
          date: new Date('2025-08-05'),
          urgency: 'urgent',
          status: 'scheduled'
        },
        {
          id: 'OP014',
          patientName: 'Ms Morag Campbell',
          age: 76,
          gender: 'F',
          chiNumber: 'CHI 582934071',
          consultant: 'Mr THOMSON',
          procedure: 'Eyelid surgery - functional',
          location: 'LA',
          appointmentType: 'Surgery',
          timeSlot: '8:00 AM',
          date: new Date('2025-08-05'),
          urgency: 'routine',
          status: 'confirmed'
        },
        {
          id: 'OP015',
          patientName: 'Mr Hamish Ross',
          age: 41,
          gender: 'M',
          chiNumber: 'CHI 294857301',
          consultant: 'Mr STEWART',
          procedure: 'Burn scar revision - arm',
          location: 'Theatre 2',
          appointmentType: 'Surgery',
          timeSlot: '9:00 AM',
          date: new Date('2025-08-05'),
          urgency: 'routine',
          status: 'scheduled'
        },
        {
          id: 'OP016',
          patientName: 'Ms Ailsa MacKay',
          age: 55,
          gender: 'F',
          chiNumber: 'CHI 638472950',
          consultant: 'Mr FRASER',
          procedure: 'Lipoma removal - shoulder',
          location: 'LA',
          appointmentType: 'Minor Surgery',
          timeSlot: '10:00 AM',
          date: new Date('2025-08-05'),
          urgency: 'non-priority',
          status: 'scheduled'
        },

        // July 31, 2025 - Yesterday's completed list
        {
          id: 'OP017',
          patientName: 'Mr Ian Sinclair',
          age: 62,
          gender: 'M',
          chiNumber: 'CHI 847293051',
          consultant: 'Mr DAVIDSON',
          procedure: 'Skin graft - leg ulcer',
          location: 'Theatre 1',
          appointmentType: 'Surgery',
          timeSlot: '8:00 AM',
          date: new Date('2025-07-31'),
          urgency: 'urgent',
          status: 'completed'
        },
        {
          id: 'OP018',
          patientName: 'Ms Shona Grant',
          age: 73,
          gender: 'F',
          chiNumber: 'CHI 395847201',
          consultant: 'Mr THOMSON',
          procedure: 'Facial lesion excision',
          location: 'LA',
          appointmentType: 'See and treat',
          timeSlot: '9:00 AM',
          date: new Date('2025-07-31'),
          urgency: 'routine',
          status: 'completed'
        },

        // Today's list (July 30, 2025)
        {
          id: 'OP019',
          patientName: 'Mr Alasdair Reid',
          age: 48,
          gender: 'M',
          chiNumber: 'CHI 746293850',
          consultant: 'Mr STEWART',
          procedure: 'Carpal tunnel release',
          location: 'Theatre 3',
          appointmentType: 'Surgery',
          timeSlot: '9:30 AM',
          date: new Date('2025-07-30'),
          urgency: 'routine',
          status: 'in-progress'
        },
        {
          id: 'OP020',
          patientName: 'Ms Kirsty MacLeod',
          age: 29,
          gender: 'F',
          chiNumber: 'CHI 593847201',
          consultant: 'Mr FRASER',
          procedure: 'Scar revision - facial',
          location: 'LA',
          appointmentType: 'Minor Surgery',
          timeSlot: '11:00 AM',
          date: new Date('2025-07-30'),
          urgency: 'non-priority',
          status: 'scheduled'
        }
      ];
      
      setOpListEntries(mockData);
      setLoading(false);
    };

    loadOpListData();
  }, []);

  const consultants = Array.from(new Set(opListEntries.map(entry => entry.consultant)));

  const filteredEntries = opListEntries.filter(entry => {
    const matchesDate = entry.date.toISOString().split('T')[0] === selectedDate;
    const matchesConsultant = filterConsultant === 'all' || entry.consultant === filterConsultant;
    const matchesSearch = searchTerm === '' || 
      entry.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.chiNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesConsultant && matchesSearch;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'urgent';
      case 'routine': return 'routine';
      case 'non-priority': return 'non-priority';
      default: return 'routine';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'scheduled';
      case 'confirmed': return 'confirmed';
      case 'in-progress': return 'in-progress';
      case 'completed': return 'completed';
      default: return 'scheduled';
    }
  };

  const exportOpList = () => {
    const csvContent = [
      ['Patient Name', 'Age/Gender', 'CHI Number', 'Consultant', 'Procedure', 'Location', 'Type', 'Time', 'Status'],
      ...filteredEntries.map(entry => [
        entry.patientName,
        `${entry.age}/${entry.gender}`,
        entry.chiNumber,
        entry.consultant,
        entry.procedure,
        entry.location,
        entry.appointmentType,
        entry.timeSlot,
        entry.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `op-list-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="op-list-section">
        <div className="op-list-header" onClick={onToggle}>
          <div className="section-title">
            <Calendar size={24} />
            <h3>Op List Management</h3>
          </div>
          <div className="loading-spinner small"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="op-list-section">
      <div className="op-list-header" onClick={onToggle}>
        <div className="section-title">
          <Calendar size={24} />
          <h3>Op List Management</h3>
          <span className="entry-count">({filteredEntries.length} patients scheduled)</span>
        </div>
        <div className="toggle-icon">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="op-list-content">
          <div className="op-list-controls">
            <div className="control-group">
              <label htmlFor="date-select">Date:</label>
              <input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="control-group">
              <label htmlFor="consultant-filter">Consultant:</label>
              <select
                id="consultant-filter"
                value={filterConsultant}
                onChange={(e) => setFilterConsultant(e.target.value)}
              >
                <option value="all">All Consultants</option>
                {consultants.map(consultant => (
                  <option key={consultant} value={consultant}>{consultant}</option>
                ))}
              </select>
            </div>

            <div className="control-group search-group">
              <label htmlFor="search-input">Search:</label>
              <div className="search-input-wrapper">
                <Search size={16} />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search patients, procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button className="export-btn" onClick={exportOpList}>
              <Download size={16} />
              Export List
            </button>
          </div>

          <div className="op-list-summary">
            <div className="summary-item">
              <span className="summary-label">Total Patients:</span>
              <span className="summary-value">{filteredEntries.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Urgent Cases:</span>
              <span className="summary-value urgent">{filteredEntries.filter(e => e.urgency === 'urgent').length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Consultants:</span>
              <span className="summary-value">{new Set(filteredEntries.map(e => e.consultant)).size}</span>
            </div>
          </div>

          <div className="op-list-table-container">
            <table className="op-list-table">
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Consultant</th>
                  <th>Procedure</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className={`entry-row ${getUrgencyColor(entry.urgency)}`}>
                    <td className="patient-details">
                      <div className="patient-name">
                        <User size={16} />
                        <span>{entry.patientName}</span>
                      </div>
                      <div className="patient-meta">
                        <span className="age-gender">{entry.age}/{entry.gender}</span>
                        <span className="chi-number">{entry.chiNumber}</span>
                      </div>
                    </td>
                    <td className="consultant">
                      <span className="consultant-name">{entry.consultant}</span>
                    </td>
                    <td className="procedure">
                      <span className="procedure-text">{entry.procedure}</span>
                    </td>
                    <td className="location">
                      <span className="location-text">{entry.location}</span>
                    </td>
                    <td className="appointment-type">
                      <span className="type-text">{entry.appointmentType}</span>
                    </td>
                    <td className="time-slot">
                      <Clock size={14} />
                      <span>{entry.timeSlot}</span>
                    </td>
                    <td className="status">
                      <span className={`status-badge ${getStatusColor(entry.status)}`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEntries.length === 0 && (
              <div className="no-entries">
                <Calendar size={48} />
                <h4>No patients scheduled</h4>
                <p>No patients found for the selected date and filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpList;
