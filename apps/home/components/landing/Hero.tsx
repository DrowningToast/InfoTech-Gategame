import {
  firebaseUserAtom,
  signinWithGooglePopUp,
  SignOut,
} from "firebase-auth-api";
import { User } from "firebase/auth";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import Wallet from "../wallet/Wallet";

const Hero = () => {
  const router = useRouter();
  const [user] = useAtom(firebaseUserAtom);

  const checkDomainName = async (user: User) => {
    const domain = user.email?.split("@")[1];
    if (!user.email) {
      return alert("Fatal error missing Email address");
    }
    if (domain !== "kmitl.ac.th") {
      await SignOut();
      alert("Please use KMITL domain");
      router.push("/");
      return;
    }
    const facultyCode = `${user.email[2]}${user.email[3]}`;
    if (facultyCode !== "07") {
      await SignOut();
      alert(
        "This event is exclusively for Information Technology students of KMITL"
      );
      router.push("/");
      return;
    }
  };
  return (
    <section className="bg-dark w-screen md:px-20 pt-8 pb-20 md:py-28 lg:py-14 relative min-h-screen lg:max-h-screen lg:flex lg:flex-col">
      {!user ? (
        <div className="flex flex-col gap-y-8 z-20">
          <div className="flex flex-col justify-center md:items-start items-center mx-auto md:mx-0 px-2  z-20">
            <h1 className="yellow-gradient-text leading-[240px] inline-block align-middle font-extrabold text-8xl md:text-[240px] font-ranger pr-8">
              ITGG
            </h1>
            <h2 className="yellow-gradient-text leading-[128px] transform -translate-y-32 md:-translate-y-16 table-cell text-6xl md:text-[128px] font-ranger  pr-8">
              2022
            </h2>
          </div>
          <div className="whitespace-pre w-screen md:w-auto text-center md:text-left text-sm md:text-2xl font-kanit z-20 mt-48 md:mt-0">
            <div className="md:static absolute top-1/3 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:translate-y-0  tracking-widest">
              <span className="whitespace-pre text-tertiary font-kanit font-normal md:font-light">
                กลับมาอีกครั้งสำหรับการมหกรรมแข่งขันที่ใหญ่ที่สุด
              </span>
              <br />
              <span className=" text-tertiary font-kanit font-normal md:font-light">
                มันจะเป็นอีกครั้งที่คณะไอทีจะต้องลุกเป็นไฟ
              </span>
            </div>
            <button
              onClick={() => {
                if (!user) signinWithGooglePopUp(checkDomainName);
              }}
              className="text-white md:static absolute top-4 right-4 cursor-pointer my-4 tracking-widest inline-block font-light px-4 py-1 border-white border-2 md:border-4 rounded-md"
            >
              {!user ? "เข้าสู่ระบบ" : "กำลังเข้าสู่ระบบ. . ."}
            </button>
          </div>
        </div>
      ) : (
        <Wallet />
      )}
      <div className="absolute inset-0 overflow-hidden">
        {/* bg */}
        <div
          style={{
            backgroundImage: "url(/assets/hero.png)",
            backgroundPosition: "40% 35%",
          }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover blur-sm transform translate-y-1/3"
        ></div>
        {/* fire png */}
        <div
          style={{
            backgroundImage: "url(/assets/Fire.png)",
            // backgroundPosition: "50% 20%",
          }}
          className="absolute -inset-x-24 inset-y-0 md:inset-0 bg-no-repeat bg-center bg-cover blur-0 transform translate-y-1/4 md:scale-100 scale-75"
        ></div>
      </div>
      {/* Upper gradient */}
      <div className="upper-dark-gradient inset-0 bottom-[10%] absolute z-10"></div>
      {/* Bottom gradient */}
      <div className="bottom-dark-gradient bottom-0 top-3/4 inset-x-0 absolute z-10 transform translate-y-1"></div>
    </section>
  );
};

export default Hero;
