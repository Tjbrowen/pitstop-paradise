
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
        padding: '100px 0', 
        backgroundRepeat: "no-repeat",
      minHeight: "100vh", 
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" gutterBottom>
          Welcome to PitStop Paradise
        </Typography>
        <Typography variant="body1" paragraph>
        Welcome to our online store—your one-stop destination for premium vapes and CBD products! 
        </Typography>
        <Typography variant="body1" paragraph>
          We are dedicated to providing you with top-quality products that enhance your lifestyle and promote relaxation, whether you’re at home or on the go.
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
