# this is the private key for simulation since private key did not work due to an formatting issue i created this with UFT-8 encoding

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(BASE_DIR, "private.pem.key")

# We embed the exact text here so Windows cannot mess with the encoding
key_data = """-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtYtlI7l5+9cp/mN7LntRmqumRy7OLUVfst3AczOVOuvEZCVZ
XZ8Pvm7gTsY5V9yuX1kCyPyx5yP/bdYy95TzvHPVSG2Zqe1HBfPqOOk/1XI6ReoP
seN9aHFdbqgiSG5l82uFpxHpx8Fz1XyK6N5s8vbypOJ0fzjt36g+2RLt9GpHKGT3
UsGx2V2qzyH7caSK3RlzFURGvu/X+L9lg4jqm89DmQYT+Zk/c9Nqnarnymxkjk7q
6ExsV/Z2OfWw86N1wC6ljPItLA6PDiAmWxvnIY8JkzrGAcgGRXwOlMHeRA560qIN
bZ0npjN5bHupXptRgGxjpLv0wLr9BfTbKgQofwIDAQABAoIBAHrX2hY0WUB6NaY3
NpEbTPq2D4u3NjgX60ujFaheTSpTgs6pHzFkgki/yfRD2WWEpFFMb8AEjXT0PNDb
0h0Jo2vvjXC3CPWc4yQ6ClF8M3+BDcFlQj2Cy8cyfqB0EM6mNUJjjUqhqmlKk9Dv
tycf6uT1CPddbKrxoLRoqi5EytNJOuiAST/1PtQK/Qs+Ml+y/i6pKhQc3eUaUn40
SCndXrgJhToKIDVHYeKDZxwDYtGwLD0SrGmVywsT8akEEDLpOcRFaOFGEuE+eP//
W6KFheLNW5P9Eiw33pUn1I7DhFVS/HoPm7Dt0T+i7AbUS5BtpO3+7NvlUIiHVi6D
XoBxcnECgYEA4BO0lKSpEIkMpwt/xi7rohFw1Ujnt9Cx7piSEePV/GYKdZe6ZIJG
ClwGMk0ihGsItuHI7s0PpvkPtUgQxnaRuu1F8AXj2uyjvOx6DfagCLrXxLkaqDrR
oEVUd2wyJKiBFEt0ruQlGDpx8lSl8fLPIPQntHBXZAIRs3LyH2YnYN0CgYEAz2h9
zkWYKHJ+Dyt9jZW6IkV60of1yodwVV60z9SLtPKJmm77ehUzmbaXju7O5GZVhiJ6
r0Tkg1MzNEeWSJo5o4/77QL7Cg6kFeDOiqL8I0HVB//FlifLg3h1Bz1L/guAjSo/
FOVurDOQC5pj68miEETBf6e+YD4i/yn1yPZ3iwsCgYEAx0gfKLdMeJ06OHHcoDfo
bgmOzND665paNHVSK0DydXeWw8A+D9dgTSRMin3ZPeUnKeah2edbjUch9jpyWN7o
elM9CNtkKracZI/3eOWmrDznWli5YXZ2KlCeb1s1OS73JUJ6MnRKnUKVRkyMDSLB
nXAmw63JuvKwJWUL+mrSiK0CgYAQ5LfqhyyfjsPJxIcTczCX/gTFBSH1/xYdPfuI
Og2vDVo74/JDvVpYmNC7aaQcYmFw7XoEsJ3UPICdL3+EJluvgNjKM0XzScH/rjHk
hOX4kTIi1qhnVJJ1AOi3UDzSUmmEFf7RWuaqzABdkZO17tRucss39JfDCwyar/Y/
CiQuhQKBgQDR5PJMxcT2ca2WxLOJUOOsEkgZCh4Ybkp4tyRvt7VUQ9jq9PN/Kka8
SDFxfKE+qwUiPm05dJAiwnJht/aIoU44m4H+1jSm04OX6K9mNj0MLET3NG6gE/Jz
krMtsh2qcmRX7yFXzYXiFNWahWMUvgJb1bE02EtOawY8itbItBJ6eg==
-----END RSA PRIVATE KEY-----"""

# Write the file strictly as Linux-style UTF-8
with open(key_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(key_data.strip() + '\n')

print("SUCCESS: private.pem.key has been perfectly recreated by Python!")