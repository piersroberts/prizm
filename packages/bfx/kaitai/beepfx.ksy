meta:
  id: beepfx
  file-extension: beepfx
  endian: le

seq:
  - id: entries
    type: entry
    repeat: until
    repeat-until: _.type == 0x00  # End marker

types:
  entry:
    seq:
      - id: type
        type: u1
      - id: data
        type: entry_data
        if: type != 0x00

  entry_data:
    type: switch
    switch-on: _parent.type
    cases:
      0x01..0x7F: 
        - id: frequency
          type: u2
        - id: duration
          type: u2
      0x80..0xFF:  # Control codes like pause or envelope control
        - id: control_code
          type: u1
        - id: control_value
          type: u1
