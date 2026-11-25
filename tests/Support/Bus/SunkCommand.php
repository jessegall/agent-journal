<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Contracts\Bus\Command;

/**
 * A command the test sink took in place of its handler: the command as it reached the end, the middleware it passed,
 * who sent it and under which request key.
 */
final readonly class SunkCommand
{
    /**
     * @param  Command<mixed>  $command
     * @param  list<class-string>  $trail
     */
    public function __construct(
        public Command $command,
        public array $trail,
        public string|null $actor,
        public string|null $requestKey,
    ) {}

    /**
     * @return class-string<Command<mixed>>
     */
    public function name(): string
    {
        return $this->command::class;
    }

    /**
     * Whether the command is of the class and each named public property holds exactly the given value.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function matches(string $command, array $arguments): bool
    {
        if ($command !== $this->command::class) {
            return false;
        }

        foreach ($arguments as $property => $value) {
            if (! property_exists($this->command, $property) || $this->command->{$property} !== $value) {
                return false;
            }
        }

        return true;
    }
}
