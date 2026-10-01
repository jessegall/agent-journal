import sys
from pathlib import Path

from ledgerly.invoice import loaded
from ledgerly.printed import printed

print(printed(loaded(Path(sys.argv[1]))))
