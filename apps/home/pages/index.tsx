import type { NextPage } from "next";
import Head from "next/head";
import Agenda from "../components/agenda/Agenda";
import GGDay from "../components/banner/GGDay";
import Hero from "../components/landing/Hero";
import Scoreboard from "../components/scoreboard/Scoreboard";

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Head>
        <title>Gate Game 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-dark w-full overflow-x-hidden min-h-screen grid place-items-center">
        <Hero />
        <Scoreboard />
        <Agenda />
        <GGDay />
      </main>
    </div>
  );
};

export default Home;
