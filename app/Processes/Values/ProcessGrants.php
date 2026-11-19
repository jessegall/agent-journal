<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\CommandClass;

/**
 * What a profile declares its agents may run: allowed and denied command classes, the ceiling no allow goes past, and
 * allowed and denied exact patterns. A denial always beats an allow.
 */
final readonly class ProcessGrants
{
    public function __construct(
        public CommandClassSet $allowed,
        public CommandClassSet $denied,
        public CommandClassSet $ceiling,
        public CommandPatternSet $allowedPatterns,
        public CommandPatternSet $deniedPatterns,
    ) {}

    /**
     * Every known class allowed, nothing denied: what a profile that may run anything declares.
     */
    public static function everything(): self
    {
        $all = CommandClassSet::of(...CommandClass::cases());

        return new self($all, CommandClassSet::empty(), $all, CommandPatternSet::of(), CommandPatternSet::of());
    }

    /**
     * Reading, version control and the journal, with a ceiling that never admits a write, edit, delete, process
     * control, privilege change, install, check or build.
     */
    public static function readingOnly(): self
    {
        return new self(
            CommandClassSet::of(CommandClass::Read, CommandClass::VersionControl, CommandClass::JournalOperation),
            CommandClassSet::of(CommandClass::PrivilegeChange),
            CommandClassSet::of(
                CommandClass::Read,
                CommandClass::VersionControl,
                CommandClass::JournalOperation,
                CommandClass::Network,
            ),
            CommandPatternSet::of(),
            CommandPatternSet::of(),
        );
    }
}
