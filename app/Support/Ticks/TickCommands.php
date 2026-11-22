<?php

declare(strict_types=1);

namespace App\Support\Ticks;

use App\Contracts\Bus\Command;
use App\Exceptions\TooManyTickCommands;

/**
 * The commands one tick asks for, in the order they run; a tick asks for a few at most.
 */
final readonly class TickCommands
{
    public const int MAXIMUM = 10;

    /**
     * @param  list<Command<mixed>>  $commands
     */
    private function __construct(private array $commands) {}

    public static function none(): self
    {
        return new self([]);
    }

    /**
     * @param  Command<mixed>  ...$commands
     *
     * @throws TooManyTickCommands
     */
    public static function of(Command ...$commands): self
    {
        if (count($commands) > self::MAXIMUM) {
            throw TooManyTickCommands::count(count($commands), self::MAXIMUM);
        }

        return new self(array_values($commands));
    }

    /**
     * @return list<Command<mixed>>
     */
    public function all(): array
    {
        return $this->commands;
    }

    public function isEmpty(): bool
    {
        return $this->commands === [];
    }
}
