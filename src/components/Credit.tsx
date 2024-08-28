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
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  className="hover:fill-[#0ef] fill-[#4169E1] duration-200"
                  style={{  transform: "" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                  />
                </svg>
                </a>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
