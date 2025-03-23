meta:
  id: scr
  file-extension: scr

seq:
  - id: pixel_buffer
    type: pixel_buffer
  - id: attribute_buffer
    type: attribute_buffer

types:
  attribute:
    seq:
      - id: flash
        type: b1
      - id: bright
        type: b1
      - id: paper
        type: b3
      - id: ink
        type: b3
  pixel_buffer:
    seq:
      - id: pixels
        type: b1
        repeat: expr
        repeat-expr: 192*256
  attribute_buffer:
    seq:
      - id: attributes
        type: attribute
        repeat: expr
        repeat-expr: 768
