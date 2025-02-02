import { MainBase } from "airtable-api";
import Image from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Image {
  filename: string;
  height: number;
  id: string;
  size: number;
  type: `${string}/${string}`;
  url: string;
  width: number;
}

export interface Event {
  Name: string;
  Description: string;
  Date: string;
  Time: number;
  Poster: Image[];
}

type CategoriedEvent = Record<string, Event[]>;

const Agenda = () => {
  const [events, setEvents] = useState<CategoriedEvent>({});
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setDate] = useState<string>("");
  const [isFetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    setFetching(false);
    const fetchJobs = async () => {
      if (!isFetching) return;
      let response = (await MainBase("tblCbQHQQjfsMxtqg")
        .select()
        .firstPage()) as unknown;
      //@ts-ignore
      const events: Event[] = response.map((record) => {
        return {
          ...record.fields,
        };
      }) as Event[];
      const unqiueDates: string[] = [];
      const categoriedEvent: CategoriedEvent = {};
      events.forEach((event) => {
        if (!unqiueDates.includes(event.Date)) {
          unqiueDates.push(event.Date);
        }
      });
      unqiueDates.forEach((date) => {
        categoriedEvent[date] = [];
        events.forEach((event) => {
          if (date === event.Date) {
            categoriedEvent[`${date}`].push(event);
          }
        });
      });
      setDates(unqiueDates);
      setEvents(categoriedEvent);
    };

    fetchJobs();
    return () => {};
  }, []);

  return (
    <LayoutGroup>
      <motion.section
        layout
        className="w-full py-20 lg:px-20 2xl:px-40 flex flex-col items-center gap-y-4 xl:gap-x-8 xl:grid xl:grid-cols-[0.35fr_0.65fr] xl:items-start"
      >
        {/* @ts-ignore */}
        <div className="w-1/2 w-2/3 w-3/4 w-4/5 absolute"></div>

        <motion.div layout className="xl:flex xl:flex-col xl:gap-y-8">
          <h1 className="xl:text-tertiary text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl xl:text-left uppercase text-center font-bebas inline-block w-full">
            Agenda
          </h1>
          <p className="text-gray-300 font-kanit xl:font-light mx-12 xl:mx-0 text-base xl:text-xl xl:col-start-1">
            ปฏิทินกิจกรรมของ ITGG2022
            สามารถติดตามปฏิทินกิจกรรมปีนี้ได้ที่นี้เล้ยยยยย!!!
          </p>
          <nav className="flex xl:flex-col xl:items-center xl:col-start-1 xl:gap-y-4 justify-center xl:justify-start gap-x-4">
            <LayoutGroup>
              {dates?.map((date, index) => {
                if (
                  !selectedDate &&
                  index === dates.length - 1 &&
                  selectedDate !== date
                ) {
                  setDate(date);
                }
                return (
                  <motion.span
                    layout
                    key={`date-${index}`}
                    onClick={() => {
                      setDate(date);
                    }}
                    animate={{
                      color:
                        selectedDate === date ? "#ffffff" : "rgb(156 163 175)",
                    }}
                    className={`font-bebas text-2xl xl:text-5xl mt-12 xl:mt-0 inline-block cursor-pointer relative`}
                  >
                    {`${date.split("-")[2]}/${date.split("-")[1]}`}
                    {selectedDate === date && (
                      <motion.div
                        layout
                        layoutId="underline"
                        className="w-full bg-white h-0.5"
                      ></motion.div>
                    )}
                  </motion.span>
                );
              })}
            </LayoutGroup>
          </nav>
        </motion.div>
        <motion.article
          layout
          className="w-full px-8 gap-x-4 xl:gap-x-12 gap-y-4 md:gap-y-8 grid grid-cols-[0.45fr_0.55fr] md:grid-cols-[0.3fr_0.7fr] xl:row-start-1 xl:col-start-2"
        >
          {Object.keys(events).map((iteratingDate) => {
            let formatEvents: any[] = [];
            if (iteratingDate === selectedDate) {
              formatEvents = events[iteratingDate].map((event) => {
                return (
                  <>
                    {event?.Poster?.[0].url && (
                      <motion.div
                        layout
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="w-full aspect-square relative"
                      >
                        <Image src={event.Poster[0].url} layout="fill" />
                      </motion.div>
                    )}
                    <motion.div
                      layout
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className={`flex flex-col gap-y-2 ${
                        event?.Poster?.[0].url
                          ? "col-start-2"
                          : "col-start-1 col-span-2 border-2 border-primary p-4"
                      }`}
                    >
                      <small className="font-kanit text-xs lg:text-lg xl:text-xl text-white">
                        {Math.floor(event.Time / 3600)}:
                        {Math.floor(event.Time % 3600) / 60 > 9
                          ? Math.floor(event.Time % 3600) / 60
                          : `0${Math.floor((event.Time % 3600) / 60)}`}
                      </small>
                      <h3
                        className={`text-white font-ranger ${
                          event?.Poster?.[0].url
                            ? "text-2xl lg:text-3xl xl:text-5xl"
                            : "text-4xl lg:text-5xl xl:text-7xl"
                        } `}
                      >
                        {event.Name}
                      </h3>
                      <p className="font-kanit text-white text-sm xl:text-lg">
                        {event.Description}
                      </p>
                    </motion.div>
                  </>
                );
              });
            }
            return formatEvents;
          })}
        </motion.article>
      </motion.section>
    </LayoutGroup>
  );
};

export default Agenda;
