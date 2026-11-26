<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\Command;

/**
 * The commands a program driver asks to run next, in order: the orders to its host and the reports on its requests.
 */
final readonly class DriverActions
{
    /**
     * @param  list<Command<mixed>>  $commands
     */
    private function __construct(public array $commands) {}

    /**
     * @param  Command<mixed>  ...$commands
     */
    public static function of(Command ...$commands): self
    {
        return new self(array_values($commands));
    }

    public static function none(): self
    {
        return new self([]);
    }

    public function then(self $more): self
    {
        return new self([...$this->commands, ...$more->commands]);
    }
}
