import BeepolaBbsong from "../generated/BeepolaBbsong";
import { KaitaiStream } from "kaitai-struct";

export function parseBbSong(bbSong) {
  const parsedSong = new BeepolaBbsong(new KaitaiStream(bbSong));

  return parsedSong;
}
