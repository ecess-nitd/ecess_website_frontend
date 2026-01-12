import { motion } from 'framer-motion';
import { teamData } from '../data/teamData';
import { useEffect } from 'react';
import './Team.css';

const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <figure className="snip1584">
        <img src={member.image} alt={member.name} />
        <figcaption>
          <h3>{member.name}</h3>
          <h5>{member.position}</h5>
        </figcaption>
        <a href="#"></a>
      </figure>
    </motion.div>
  );
};

const Team = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="relative w-full py-20 overflow-hidden bg-slate-950 border-b border-cyan-500/20">
        <div className="absolute inset-0 opacity-10 -z-10" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.1) 25%, rgba(34, 211, 238, 0.1) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.1) 75%, rgba(34, 211, 238, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto"
          >
            Meet the dedicated individuals who drive ECESS forward with their passion and expertise
          </motion.p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Final Year */}
          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 text-center"
          >
            Final Year
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {teamData.filter(m => m.year === 'Final Year').map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>

          {/* Pre Final Year */}
          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 text-center"
          >
            Pre Final Year
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {teamData.filter(m => m.year === 'Pre Final Year').length > 0 ? (
              teamData.filter(m => m.year === 'Pre Final Year').map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))
            ) : (
              <p className="text-gray-500 text-center">Coming soon...</p>
            )}
          </div>

          {/* Second Year */}
          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 text-center"
          >
            Second Year
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {teamData.filter(m => m.year === 'Second Year').length > 0 ? (
              teamData.filter(m => m.year === 'Second Year').map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))
            ) : (
              <p className="text-gray-500 text-center">Coming soon...</p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Team;
