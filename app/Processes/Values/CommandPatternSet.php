<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * A set of exact command patterns.
 */
final readonly class CommandPatternSet
{
    /**
     * @param  list<CommandPattern>  $patterns
     */
    private function __construct(public array $patterns) {}

    public static function of(CommandPattern ...$patterns): self
    {
        return new self(array_values($patterns));
    }

    public function with(self $other): self
    {
        return new self([...$this->patterns, ...$other->patterns]);
    }

    /**
     * @param  list<string>  $argv
     */
    public function matchesAny(array $argv): bool
    {
        return array_any($this->patterns, fn (CommandPattern $pattern) => $pattern->matches($argv));
    }

    /**
     * @return list<list<string>>
     */
    public function toArray(): array
    {
        return array_map(fn (CommandPattern $pattern) => $pattern->toArray(), $this->patterns);
    }

    /**
     * @param  list<list<string>>  $stored
     */
    public static function fromArray(array $stored): self
    {
        return new self(array_map(CommandPattern::fromArray(...), $stored));
    }
}
