<?php

declare(strict_types=1);

namespace App\Hooks\Values;

use App\Bus\Contracts\Command;
use App\Hooks\Exceptions\TooManyEventCommands;

/**
 * The ordered commands and context returned by one state event listener.
 */
final readonly class EventCommands
{
    use WithContext;

    public const int MAXIMUM = 10;

    /**
     * @param  list<Command<mixed>>  $commands
     * @param  list<string>  $context
     * @param  list<string>  $messages
     */
    private function __construct(
        public array $commands,
        public array $context = [],
        public array $messages = [],
    ) {}

    public static function none(): self
    {
        return self::of();
    }

    /**
     * @param  Command<mixed>  ...$commands
     */
    public static function of(Command ...$commands): self
    {
        if (count($commands) > self::MAXIMUM) {
            throw TooManyEventCommands::count(count($commands), self::MAXIMUM);
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
}
