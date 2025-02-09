import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Welcome from '../../components/Landing/Welcome';
import Footer from '../../components/common/Footer';
import About from '../../components/Landing/About'; 
import Wait from '../../components/Landing/Wait';
import '../../styles/blob.css'; 



const fadeIn = {
  hidden: { opacity: 0, y: 100 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } }, 
};

function HomePage() {
  return (
    <div className='bg-gray-100'>
      <Navbar />
      <Welcome />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeIn}>
        <About />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeIn}>
        <Wait />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeIn}>
        <Footer />
      </motion.div>
    </div>
  );
}

export default HomePage;