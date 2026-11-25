<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandClass;

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
        $commandClasses = CommandClassSet::of(...CommandClass::cases());

        return new self(
            $commandClasses,
            CommandClassSet::none(),
            $commandClasses,
            CommandPatternSet::of(),
            CommandPatternSet::of(),
        );
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

    /**
     * Whether everything the other grants may run is within these grants: no class past this ceiling or allowed here,
     * every denial here kept, and no exact pattern this does not allow; anything it cannot prove is refused.
     */
    public function contains(self $other): bool
    {
        return $other->ceiling->isWithin($this->ceiling)
            && $other->allowed->isWithin($this->allowed)
            && $this->denied->isWithin($other->denied)
            && $other->allowedPatterns->isWithin($this->allowedPatterns)
            && $this->deniedPatterns->isWithin($other->deniedPatterns);
    }
}
