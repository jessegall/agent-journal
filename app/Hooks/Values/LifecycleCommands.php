<?php

declare(strict_types=1);

namespace App\Hooks\Values;

use App\Bus\Contracts\Command;
use App\Hooks\Exceptions\TooManyLifecycleCommands;

/**
 * The ordered commands a state's enter, resume or exit returns for the engine to run; a state runs none itself.
 */
final readonly class LifecycleCommands
{
    public const int MAXIMUM = EventCommands::MAXIMUM;

    /**
     * @param  list<Command<mixed>>  $commands
     */
    private function __construct(public array $commands) {}

    public static function none(): self
    {
        return new self([]);
    }

    /**
     * @param  Command<mixed>  ...$commands
     */
    public static function of(Command ...$commands): self
    {
        if (count($commands) > self::MAXIMUM) {
            throw TooManyLifecycleCommands::count(count($commands), self::MAXIMUM);
        }

        return new self(array_values($commands));
    }

    public function isEmpty(): bool
    {
        return $this->commands === [];
    }
}
