<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * A set of exact command patterns.
 */
final class CommandPatternSet extends Data
{
    /**
     * @param  list<CommandPattern>  $patterns
     */
    public function __construct(public readonly array $patterns) {}

    public static function of(CommandPattern ...$patterns): self
    {
        return new self(array_values($patterns));
    }

    public function union(self $other): self
    {
        return new self([
            ...$this->patterns,
            ...$other->patterns,
        ]);
    }

    /**
     * @param  list<string>  $argv
     */
    public function matchesAny(array $argv): bool
    {
        return array_any($this->patterns, fn (CommandPattern $pattern) => $pattern->matches($argv));
    }

    public function isWithin(self $other): bool
    {
        $others = $other->wordLists();

        return array_all($this->wordLists(), fn (array $pattern) => in_array($pattern, $others, true));
    }

    /**
     * @return list<list<string>>
     */
    public function wordLists(): array
    {
        return array_map(fn (CommandPattern $pattern) => $pattern->wordList(), $this->patterns);
    }

    /**
     * @param  list<list<string>>  $stored
     */
    public static function ofWordLists(array $stored): self
    {
        return new self(array_map(CommandPattern::ofWords(...), $stored));
    }
}
