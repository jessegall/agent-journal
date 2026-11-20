<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\CommandNestingTooDeep;
use Illuminate\Container\Attributes\Scoped;

/**
 * How deep commands dispatched from handlers are nested in this request; eight levels at most.
 */
#[Scoped]
final class CommandNesting
{
    private const int LIMIT = 8;

    /** @var list<class-string> */
    private array $commands = [];

    /** @param class-string $command */
    public function enter(string $command): void
    {
        if (count($this->commands) >= self::LIMIT) {
            throw CommandNestingTooDeep::at(count($this->commands) + 1);
        }

        $this->commands[] = $command;
    }

    /**
     * Whether the command running now was dispatched from another command's handler.
     */
    public function isNested(): bool
    {
        return count($this->commands) > 1;
    }

    public function runs(string $command): bool
    {
        return end($this->commands) === $command;
    }

    public function leave(): void
    {
        array_pop($this->commands);
    }
}
