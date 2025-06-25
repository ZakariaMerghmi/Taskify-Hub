import dynamic from "next/dynamic";
const CharBar = dynamic(() => import("./CharBarClientOnly"), {
  ssr: false,
});

export default CharBar;
