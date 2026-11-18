<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\CommandClass;

/**
 * What one actor may run (doc 21 revision 6, sections 10 and 28): allowed and denied classes, allowed and denied exact
 * patterns, and the role's ceiling that no allow goes past. A denied pattern or class beats every allow; an exact
 * allowed pattern admits a command its classes alone would not, within the ceiling.
 */
final readonly class CommandPermissions
{
    private function __construct(
        public string $source,
        public CommandClassSet $allowed,
        public CommandClassSet $denied,
        public CommandClassSet $ceiling,
        public CommandPatternSet $allowedPatterns,
        public CommandPatternSet $deniedPatterns,
        public int $revision,
    ) {}

    /**
     * The built-in defaults of an agent role: a read-only helper reads, uses version control and the journal, and its
     * ceiling never admits a write, edit, delete, process control, privilege change, install, check or build; the main
     * agent may run every known class.
     */
    public static function forReadOnlyHelper(string $source): self
    {
        return new self(
            $source,
            CommandClassSet::of(CommandClass::Read, CommandClass::VersionControl, CommandClass::JournalOperation),
            CommandClassSet::of(CommandClass::PrivilegeChange),
            CommandClassSet::of(CommandClass::Read, CommandClass::VersionControl, CommandClass::JournalOperation, CommandClass::Network),
            CommandPatternSet::of(),
            CommandPatternSet::of(),
            1,
        );
    }

    public static function forMainAgent(string $source): self
    {
        $everything = CommandClassSet::of(...CommandClass::cases());

        return new self($source, $everything, CommandClassSet::empty(), $everything, CommandPatternSet::of(), CommandPatternSet::of(), 1);
    }

    /**
     * A signed-in user, whom no agent role ceiling limits.
     */
    public static function forUser(): self
    {
        $everything = CommandClassSet::of(...CommandClass::cases());

        return new self('user', $everything, CommandClassSet::empty(), $everything, CommandPatternSet::of(), CommandPatternSet::of(), 1);
    }

    public function allowing(CommandPattern ...$patterns): self
    {
        return new self($this->source, $this->allowed, $this->denied, $this->ceiling, $this->allowedPatterns->with(CommandPatternSet::of(...$patterns)), $this->deniedPatterns, $this->revision);
    }

    /**
     * The permissions narrowed by revocations: their classes and patterns are denied from now on.
     */
    public function revoking(CommandClassSet $classes, CommandPatternSet $patterns): self
    {
        return new self($this->source, $this->allowed, $this->denied->union($classes), $this->ceiling, $this->allowedPatterns, $this->deniedPatterns->with($patterns), $this->revision + 1);
    }

    /**
     * Whether a part with these classes and this argv may run.
     *
     * @param  list<string>  $argv
     */
    public function admits(CommandClassSet $classes, array $argv): bool
    {
        if ($this->deniedPatterns->matchesAny($argv) || $classes->sharesAnyWith($this->denied)) {
            return false;
        }
        if (! $classes->missingFrom($this->ceiling)->isEmpty()) {
            return false;
        }

        return $this->allowedPatterns->matchesAny($argv) || $classes->missingFrom($this->allowed)->isEmpty();
    }
}
