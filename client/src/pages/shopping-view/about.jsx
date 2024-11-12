
import { Box, Typography, Container } from '@mui/material';

const About = () => {
  return (
    <Box
      sx={{
        ...styles.container,
        backgroundImage: "url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: '#fff', 
        padding: '50px 0', 
        backgroundRepeat: "no-repeat",
      minHeight: "100vh", 
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" gutterBottom>
          Welcome to PitStop Paradise
        </Typography>
        <Typography variant="body1" paragraph>
          Your one-stop destination for all things automotive and relaxation! Our state-of-the-art car service center offers a wide range of maintenance and repair services to keep your vehicle running smoothly. From oil changes to tire rotations, our expert technicians use only the highest-quality parts and equipment to ensure your car receives the best care possible.
        </Typography>
        <Typography variant="body1" paragraph>
          But that's not all - our facility also features a cozy cafe where you can unwind and recharge while you wait for your car to be serviced. Our cafe offers a selection of premium vapes and CBD products, as well as a chill spot to relax and enjoy a cup of coffee or snack. Whether you're a car enthusiast or just looking for a peaceful retreat, we've got you covered.
        </Typography>
        <Typography variant="body1" paragraph>
          Take a look around our site to learn more about our car services and cafe offerings, and come visit us today!
        </Typography>
      </Container>
    </Box>
  );
};

// Styles for the component
const styles = {
  container: {
    backgroundColor: '#000000a0', 
    padding: '40px 0',
    textAlign: 'center',
  },
};

export default About;
