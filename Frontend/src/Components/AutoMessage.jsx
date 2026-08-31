import { TypeAnimation } from 'react-type-animation';

const AutoMessage = () => {
  return (
    <div
      style={{color: 'white',display: 'flex',justifyContent: 'center',
        alignItems: 'center',textAlign: 'center', padding: '140px 0'}}>
      <TypeAnimation
        sequence={[
          'Manage Classes, Sections, and Students 📋',
          2000,
          '',
          500,
          'Track and Record Daily Attendance ✅',
          2000,
          '',
          500,
          'All your classroom needs in one place 📚',
          2000,
          '',
          500,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
        style={{fontSize: '48px',color: 'white',maxWidth: '90%',lineHeight: '1.5',}}/>
    </div>
  );
};

export default AutoMessage;
