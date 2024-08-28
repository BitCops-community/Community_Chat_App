"use client";
import React from "react";
import { Facebook, Github, Linkedin } from "lucide-react";
import { Strings } from "@/app/Strings";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreContent from "./ui/CreContent";

export default function Credit() {
  return (
    <div>
      <div
        className="flex items-center justify-between md:justify-around lg:justify-around "
        style={{
          textAlign: "center",
          paddingTop: "5px",
          borderTop: "1px solid #ddd",
        }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <p className="mb-0 text-sm cursor-pointer">
              {Strings.credit.split(" ")[0] +
                " " +
                Strings.credit.split(" ")[1]}{" "}
              <span className="text-[#007bff] underline">
                {Strings.credit.split(" ")[2]}
              </span>
            </p>
          </PopoverTrigger>
          <CreContent />
        </Popover>

        {/* Paste Your URL links in href attribute */}
        <div className="flex gap-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <p className="mb-0 text-sm cursor-pointer">
                Usefull Links By{" "}
                <span className="text-[#007bff] underline">BITCOPS</span>
              </p>
            </PopoverTrigger>
            <PopoverContent asChild>
              <div className="flex items-center justify-evenly">
                <a target="_blank" href="https://github.com/fhackker">
                  <Github className="cursor-pointer" color="#4169E1" />
                </a>

                <a href="#">
                  <Linkedin color="#4169E1" />
                </a>

                <a target="_blank" href="https://wa.me/923144709452">
                  <Image
                    src={"/whatsapp-logo-60.png"}
                    width={25}
                    height={25}
                    alt="ICON"
                  />
                </a>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
