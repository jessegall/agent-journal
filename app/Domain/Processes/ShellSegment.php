<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Inputs\PartJoin;

/**
 * The words of one simple command in a shell line, and how it joins the next command.
 */
final readonly class ShellSegment
{
    /**
     * @param  list<string>  $words  every word, redirects and leading assignments included
     */
    public function __construct(
        public array $words,
        public PartJoin $join,
    ) {}

    /**
     * The program and its arguments: leading NAME=value assignments and redirects with their targets left out.
     *
     * @return list<string>
     */
    public function commandWords(): array
    {
        $command = [];
        $skipNext = false;

        foreach ($this->words as $word) {
            if ($skipNext) {
                $skipNext = false;

                continue;
            }

            if (self::isRedirect($word)) {
                $skipNext = self::redirectTargetFollows($word);

                continue;
            }

            if ($command === [] && preg_match('/^[A-Za-z_][A-Za-z0-9_]*=/', $word) === 1) {
                continue;
            }

            $command[] = $word;
        }

        return $command;
    }

    public function hasWritingRedirect(): bool
    {
        foreach ($this->words as $word) {
            if (preg_match('/^\d?>>?/', $word) === 1 && ! str_ends_with($word, '&1') && ! str_ends_with($word, '&2')) {
                return true;
            }
        }

        return false;
    }

    public function programIsDynamic(): bool
    {
        $program = $this->commandWords()[0] ?? '';

        return preg_match('/[$`*?\[]/', $program) === 1;
    }

    private static function isRedirect(string $word): bool
    {
        return preg_match('/^\d?(>>?|<)/', $word) === 1;
    }

    private static function redirectTargetFollows(string $word): bool
    {
        return preg_match('/^\d?(>>?|<)$/', $word) === 1;
    }
}
