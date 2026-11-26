<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\CommandRules\Enums\CommandClass;
use App\Values\CommandClassSet;
use App\Values\CommandPatternSet;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a profile declares its agents may run: allowed and denied command classes, the ceiling no allow goes past, and
 * allowed and denied exact patterns. A denial always beats an allow.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProcessGrants extends Data
{
    public function __construct(
        public readonly CommandClassSet $allowed,
        public readonly CommandClassSet $denied,
        public readonly CommandClassSet $ceiling,
        public readonly CommandPatternSet $allowedPatterns,
        public readonly CommandPatternSet $deniedPatterns,
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
