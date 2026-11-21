<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\ReservedCommands;

use App\Bus\Contracts\CommandBus;
use App\Hooks\Commands\FocusInstruction;

/**
 * An ordinary handler that builds a reserved command itself, which the reserved commands check refuses.
 */
final readonly class FocusesFromAHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(): void
    {
        $this->commands->run(
            new FocusInstruction(),
        );
    }
}
