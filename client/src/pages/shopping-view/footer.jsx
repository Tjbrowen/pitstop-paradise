import { Typography } from "@material-tailwind/react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaTiktok } from "react-icons/fa";

export function SimpleFooter() {
  return (
    <footer
      className="flex w-full flex-row flex-wrap items-center justify-center gap-y-4 py-4 text-center md:justify-between bg-[url('https://res.cloudinary.com/daynaexaz/image/upload/v1728893288/blue-smokebg_cegir0.jpg')] bg-cover bg-center"
    >
      <Typography color="blue-gray" className="text-white">
        &copy; 2024 Pitstop Paradise
      </Typography>

      {/* Social Media Icons */}
      <div className="flex items-center gap-x-5 ml-12">
        {/* Facebook Icon */}
        <a
          href="https://www.facebook.com/share/1Gqsj7naPg/"
          className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon className="w-6 h-6 text-blue-600" />
        </a>

        {/* Instagram Icon */}
        <a
          href="https://www.instagram.com/pitstopparadisesales?igsh=cHVhdzBzYXg5bDNj"
          className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="w-6 h-6 text-pink-600" />
        </a>

 {/* TikTok Icon */}
  <a
          href="https://www.tiktok.com/@pitstop.paradise?_t=8rk5ovqr3Vo&_r=1"
          className="bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="w-6 h-6 text-black" />
        </a>

      </div>

      <ul className="flex flex-wrap items-center gap-y-2 gap-x-6">
        <li>
          <Typography
            as="a"
            href="about"
            color="blue-gray"
            className="font-normal transition-colors hover:text-green-500 focus:text-green-500 text-white"
          >
            About Us
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="policies"
            color="blue-gray"
            className="font-normal transition-colors hover:text-green-500 focus:text-green-500 text-white"
          >
            Important Policies
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="more-products"
            color="blue-gray"
            className="font-normal transition-colors hover:text-green-500 focus:text-green-500 text-white"
          >
            Shop More
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="contact"
            color="blue-gray"
            className="font-normal transition-colors hover:text-green-500 focus:text-green-500 text-white"
          >
            Contact Us
          </Typography>
        </li>
      </ul>
    </footer>
  );
}
