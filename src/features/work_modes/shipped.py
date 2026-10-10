from features.sequences.shipping import ShippedSequence

NEXT = "Then journal sequence next <this sequence> --about <ref>."

SEARCH_FIRST = ("Search it yourself first", "A quick question about the code or the record is two or three commands away: journal search <term>, "
                                             "grep for the name, sed the lines you need. Do that before you send a subagent, which costs a whole "
                                             "session for an answer you can read in seconds; send one only when the answer needs reading across "
                                             "many files. " + NEXT)

TAKING_A_HELPERS_REPORT = ShippedSequence(
    title="Taking a helper's report",
    brief="A helper reported. Read what it says, run the tests it names, take its commits, and release the helper, in that order.",
    steps=[
        ("Read the report", "Read the message the line names, then see what the helper changed against the job you gave it: journal worktree "
                            "drift <helper n> says what the working branch gained since, and the helper's branch holds its commits. " + NEXT),
        ("Test it", "Run the tests the report names, and only those: a helper never runs tests, so a test it wrote is yours to run, and the "
                    "whole suite waits for main. When one fails, send the failure back to the same helper with journal helper say <helper n> "
                    "\"<what failed>\", never to a new one, and stop here until it reports again. " + NEXT),
        ("Take it", "Once the helper has rebased onto the working branch, journal worktree take <helper n> brings its commits onto it. A "
                    "helper that has not rebased is told to, with journal helper say <helper n> \"rebase onto the working branch\". " + NEXT),
        ("Release it", "journal helper finish <helper n> packs its environment away, and journal todo done <n> --how \"<what landed>\" closes "
                       "each row it was given. A fix goes out as a patch, with the sequence Cutting a patch release: journal sequence run "
                       "<Cutting a patch release>; a feature waits for the next minor. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
)

ROUTING_A_USERS_REPORT = ShippedSequence(
    title="Routing a user's report",
    brief="The user, or a project that runs on the journal, reported something wrong or asked for something. File it first, then send it "
          "to whoever does it best, so that you stay free to orchestrate.",
    steps=[
        SEARCH_FIRST,
        ("File it", "journal todo create \"<the thing, in at most 80 characters>\" --brief \"<their words, the evidence and where to start>\" "
                    "before you look at files or begin: a report from a running project is critical, and a priority the user names is theirs. "
                    + NEXT),
        ("Send it", "A job that writes goes to a helper: journal helper say <n> \"<the job>\" --todos <to-do n> to one that already touched "
                    "the files, else journal helper dispatch with the model the job needs and no more. Reading, research and design go to "
                    "a subagent. Keep to yourself only a review or a small fix. Every dispatch names its model and its agent. " + NEXT),
        ("Tell the user", "Say in one plain line what you did and when it will happen, naming each row with its type, such as to-do 12; "
                          "nothing about the journal's own steps. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
)

CUTTING_A_PATCH_RELEASE = ShippedSequence(
    title="Cutting a patch release",
    brief="Fixes that were taken and tested go out at once as a patch; features wait for the next minor.",
    steps=[
        ("Check what goes in", "Only fixes whose tests ran and passed go into a patch: journal helper peers and journal todo all show what "
                               "was taken since the last release. Leave a feature and anything untested for the next minor. " + NEXT),
        ("Bump and note it", "Raise the patch number where the project keeps its version, add a line to its changelog for each fix, and "
                             "commit both with a message that names the fixes. " + NEXT),
        ("Tag and push", "Tag the version and push it the way the project releases, with its own command or gate if it has one. A fix for "
                         "a project that runs on the journal is released at once, without the whole suite. " + NEXT),
        ("Tell the user", "Say in one plain line which version went out and what it holds, naming each fix with its row. Finish with "
                          "journal sequence next <this sequence> --about <ref>."),
    ],
)

SEQUENCES = (TAKING_A_HELPERS_REPORT, ROUTING_A_USERS_REPORT, CUTTING_A_PATCH_RELEASE)
