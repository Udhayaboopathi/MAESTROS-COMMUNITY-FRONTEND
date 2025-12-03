"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "1v1 Championship",
    description: "Prove your skills in our intense 1v1 tournament",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 64,
    maxParticipants: 128,
    prize: "₹10,000",
    game: "BGMI",
    status: "open",
  },
  {
    id: 2,
    title: "Squad Showdown",
    description: "Team up and dominate in our squad tournament",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 32,
    maxParticipants: 64,
    prize: "₹25,000",
    game: "BGMI",
    status: "open",
  },
  {
    id: 3,
    title: "Community Night",
    description: "Fun matches and prizes for all members",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 156,
    maxParticipants: 200,
    prize: "Exclusive Badges",
    game: "Multiple",
    status: "open",
  },
];

export default function LatestEvents() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8 text-gold" />
            <h2 className="text-4xl font-bold text-gold">Upcoming Events</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join our exciting tournaments and community events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {event.description}
                  </p>
                </div>
                <span className="badge-gold">{event.status}</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>{event.game}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4 text-gold" />
                  <span>
                    {event.participants}/{event.maxParticipants} participants
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span>{event.prize}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-steel">
                <div className="mb-2 flex justify-between text-xs text-gray-400">
                  <span>Registration</span>
                  <span>
                    {Math.round(
                      (event.participants / event.maxParticipants) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-steel rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${
                        (event.participants / event.maxParticipants) * 100
                      }%`,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-gold"
                  />
                </div>
              </div>

              <Link
                href={`/events/${event.id}`}
                className="mt-4 btn-outline-gold w-full text-center block group"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/events" className="btn-ghost">
            View All Events
            <ArrowRight className="w-5 h-5 inline-block ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
