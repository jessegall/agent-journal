"""The login page run apart, started with the server's routes loaded so its gate resolves each request as the journal does."""
import sys

import commands.http  # noqa: F401  registers the routes the gate resolves requests against
from features.hosted_journal.apart import main

if __name__ == "__main__":
    main(sys.argv[1:])
