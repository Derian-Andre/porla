import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdClose, MdDone, MdDownload, MdOutlineWarningAmber, MdPause, MdUpload } from "react-icons/md";
import { getState, getStateColor } from "../utils/torrentStates";
import { useTranslation } from "react-i18next";

interface IProgressLabelProps {
  torrent: any;
  showNumber: boolean;
}

export default function ProgressLabel({ torrent, showNumber }: IProgressLabelProps) {
  const { t } = useTranslation();

  const state = getState(torrent);
  const color = getStateColor(state);

  const icons = {
    "completed": MdDone,
    "downloading": MdDownload,
    "error": MdClose,
    "paused": MdPause,
    "seeding": MdUpload,
    "unknown": MdOutlineWarningAmber,
  };

  return showNumber && state === "downloading"
    ? (<>{Math.trunc(torrent.progress * 100)}%</>)
    : (<Icon className="icon-state" aria-label={t(state)} as={icons[state]} color={color} w={5} h={5}/>)
}
