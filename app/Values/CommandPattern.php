<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One exact command an actor may or may not run: its program and every word after it, so nothing unspecified trails
 * it. No glob and no regular expression: an allowed curl --head https://example.org/ allows only that invocation.
 */
final readonly class CommandPattern
{
    /**
     * @param  list<string>  $words  the program and its words, as an argv
     */
    private function __construct(public array $words) {}

    public static function exact(string $program, string ...$words): self
    {
        return new self([
            basename($program),
            ...array_values($words),
        ]);
    }

    /**
     * @param  list<string>  $argv
     */
    public function matches(array $argv): bool
    {
        return $argv !== [] && [
            basename($argv[0]),
            ...array_slice($argv, 1),
        ] === $this->words;
    }

    /**
     * @return list<string>
     */
    public function wordList(): array
    {
        return $this->words;
    }

    /**
     * @param  list<string>  $words
     */
    public static function ofWords(array $words): self
    {
        return new self($words);
    }
}
