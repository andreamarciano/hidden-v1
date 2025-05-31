import { useEffect } from "react";

import { TrashProvider } from "../comp/aboutComp/trash/TrashContext";
import TrashBin from "../comp/aboutComp/trash/TrashBin";
import TrashCollector from "../comp/aboutComp/trash/TrashCollector";

import FallingDiv from "../comp/aboutComp/specialDiv/FallingDiv";
import MeltingDiv from "../comp/aboutComp/specialDiv/MeltingDiv";
import TiltDiv from "../comp/aboutComp/specialDiv/TiltDiv";

function About() {
  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <TrashProvider>
      {/* Vertical Scroll Bar */}

      <div className="py-8 bg-gradient-to-r from-blue-300 via-green-300 to-orange-300">
        <div className="max-w-5xl mx-auto px-6">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            About Us
          </h1>

          {/* FALLING - Sec 1: Our Story */}
          <FallingDiv>
            <h2 className="text-2xl font-semibold text-gray-700 py-1">
              Our Story
            </h2>
            <p className="text-gray-600 max-w-2xl mb-2 py-2">
              Back in <strong>1972</strong>, a group of visionary farmers
              decided that Earth simply wasn't enough to raise the best eggs.
              With a second-hand rocket and a couple of very brave chickens, we
              launched our first farm on the <strong>Moon</strong>. Today, we
              continue to innovate, bringing the most extraordinary eggs in the
              universe to your table!
            </p>
          </FallingDiv>

          {/* TILT - Sec 2: Our Mission */}
          <TiltDiv />

          {/* Sec 3: Where We Are */}
          <div className="mb-10 mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Where We Are
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center">
              Though we dream among the stars, our main headquarters is nestled
              in a quiet farm
              <strong> among the hills of Ouagadougou</strong>, surrounded by
              happy hens, eccentric scientists, and a few sheep who wandered in
              by accident.
            </p>

            <div className="bg-white shadow-md p-5 rounded-lg mt-4 max-w-2xl mx-auto text-center hover:scale-105 transition-all ease-linear cursor-pointer">
              <p className="text-gray-700">
                📍 <strong>Address:</strong> Rebel Hens Lane, 42, 00042, Lunar
                Farm, Burkina Faso
              </p>
              <p className="text-gray-700">
                📞 <strong>Phone:</strong> +39 555-OVO-123
              </p>
              <p className="text-gray-700">
                📧 <strong>Email:</strong> info@moonlayeggs.com
              </p>
            </div>
          </div>

          {/* Sec 4: Our Team */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-2 mb-6 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 rounded-tl-3xl rounded-br-3xl text-center shadow-2xl shadow-blue-600/80">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Our team is a wild mix of{" "}
              <strong>farmers, mad scientists, and retired astronauts</strong>.
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 max-w-2xl mx-auto text-center mb-1">
              <li>
                🥚 <strong>Dr. Eggo Nauta</strong> - Former astronaut, now Head
                of Egg Quality.
              </li>
              <li>
                🥚 <strong>Ms. Yolanda Yolk</strong> - Specialist in space hens
                and flavor development.
              </li>
              <li>
                🥚 <strong>Professor Albumino</strong> - Chief scientist, in
                charge of zero-gravity eggs.
              </li>
            </ul>
          </div>

          {/* Sec 5: Special Eggs */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-2 mb-6 bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 rounded-tr-3xl rounded-bl-3xl text-center shadow-2xl shadow-blue-600/80">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Our Special Eggs
            </h2>
            <ul className="list-disc pl-5 text-gray-600 max-w-2xl mb-1">
              <li>
                🚀 <strong>ZeroG Eggs</strong> - Perfect for space missions.
                They don’t roll away!
              </li>
              <li>
                🌈 <strong>Rainbow Eggs</strong> - The yolk changes color
                depending on the cook’s mood.
              </li>
              <li>
                🎵 <strong>Singing Eggs</strong> - Crack one open and it sings a
                random tune.
              </li>
              <li>
                🔥 <strong>Volcanic Eggs</strong> - They cook themselves!
                (Handle with care.)
              </li>
            </ul>
          </div>

          {/* MELTING - Sec 6: Sustainability */}
          <MeltingDiv>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Sustainability & Innovation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-1">
              Our lunar farm is fully solar-powered and recycles 100% of its
              resources. We're also experimenting with{" "}
              <strong>bionic chickens</strong> — though they tend to rebel… for
              now.
            </p>
          </MeltingDiv>

          {/* Sec 7: Why Choose Us */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-2 mb-10 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 rounded-tl-3xl rounded-br-3xl text-center shadow-2xl shadow-blue-600/80">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Why Choose Us?
            </h2>
            <ul className="list-disc pl-5 text-gray-600 max-w-2xl">
              <li>
                ✔️ <strong>Truly one-of-a-kind eggs on Earth</strong> (literally
                — some come from outer space!)
              </li>
              <li>
                ✔️ <strong>Innovation and creativity</strong> in every product.
              </li>
              <li>
                ✔️ <strong>100% happy hens</strong> (with space helmets).
              </li>
              <li>
                ✔️ <strong>Always-available customer service</strong> (except
                during launch countdowns).
              </li>
            </ul>
          </div>
        </div>

        {/* Trash */}
        <TrashBin />
        <TrashCollector />
      </div>
    </TrashProvider>
  );
}

export default About;
