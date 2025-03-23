meta:
  id: beepola_bbsong
  endian: le
  encoding: ASCII

seq:
  - id: header
    type: header
  - id: info_chunk
    type: info_chunk
  - id: layout_chunk
    type: layout_chunk
  - id: pattern_data_chunk
    type: pattern_data_chunk
  # - id: savage
  #   type: savage
  #   if: info_chunk.playback_engine.value == "SVG"

types:
  savage:
    seq:
      - id: data
        size-eos: true
  kv_string:
    seq:
      - id: key
        type: str
        terminator: 0x3d
      - id: value
        type: strz
  chunk_terminator:
    seq:
      - id: chunk_terminator
        type: strz
        valid: '":END"'
  header:
    seq:
      - id: file_header
        type: strz
        valid: '"BBSONG"'
      - id: file_version
        type: strz
  info_chunk:
    seq:
      - id: header
        type: strz
        valid: "':INFO'"
      - id: song_title
        type: kv_string
      - id: song_author
        type: kv_string
      - id: playback_engine
        type: kv_string
      - id: chunk_terminator
        type: chunk_terminator
  layout_chunk:
    seq:
      - id: header
        type: strz
        valid: "':LAYOUT'"
      - id: loop_start_point
        type: kv_string
      - id: length
        type: kv_string
      - id: song_layout_data
        size: length.value.to_i
      - id: chunk_terminator
        type: chunk_terminator
  pattern_data_chunk:
    seq:
      - id: header
        type: strz
        valid: "':PATTERNDATA'"
      - id: pattern_count
        type: kv_string
      - id: pattern_data
        type: pattern_data_block
        repeat: expr
        repeat-expr: pattern_count.value.to_i
      - id: chunk_terminator
        type: chunk_terminator
  pattern_data_block:
    seq:
      - id: pattern_name
        type: kv_string
      - id: pattern_length
        type: s4
      - id: pattern_tempo
        type: s4
      - id: channel_1_data
        size: pattern_length
      - id: channel_2_data
        size: pattern_length
      - id: percussion_data
        size: pattern_length
      - id: channel_1_additional
        size: pattern_length
      - id: channel_2_additional
        size: pattern_length
