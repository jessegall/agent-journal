<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What one actor may run: allowed and denied classes, allowed and denied exact
 * patterns, and the declared ceiling that no allow goes past. A denied pattern or class beats every allow; an exact
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
     * The permissions a declaration grants, named by where they come from, such as a profile revision.
     */
    public static function granted(string $source, ProcessGrants $grants): self
    {
        return new self(
            $source,
            $grants->allowed,
            $grants->denied,
            $grants->ceiling,
            $grants->allowedPatterns,
            $grants->deniedPatterns,
            1,
        );
    }

    public function allowing(CommandPattern ...$patterns): self
    {
        return clone ($this, ['allowedPatterns' => $this->allowedPatterns->with(CommandPatternSet::of(...$patterns))]);
    }

    /**
     * The permissions narrowed by revocations: their classes and patterns are denied from now on.
     */
    public function revoking(CommandClassSet $classes, CommandPatternSet $patterns): self
    {
        return clone ($this, [
            'denied' => $this->denied->union($classes),
            'deniedPatterns' => $this->deniedPatterns->with($patterns),
            'revision' => $this->revision + 1,
        ]);
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
