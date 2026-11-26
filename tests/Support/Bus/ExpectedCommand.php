<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Bus\Contracts\Command;

/**
 * A command a test expects the sink to have taken: its class and the public properties it must hold.
 */
final readonly class ExpectedCommand
{
    /**
     * @param  class-string<Command<mixed>>  $command
     * @param  array<string, mixed>  $arguments
     */
    private function __construct(public string $command, public array $arguments) {}

    /**
     * @param  class-string<Command<mixed>>  $command
     * @param  array<string, mixed>  $arguments
     */
    public static function of(string $command, array $arguments = []): self
    {
        return new self($command, $arguments);
    }
}
