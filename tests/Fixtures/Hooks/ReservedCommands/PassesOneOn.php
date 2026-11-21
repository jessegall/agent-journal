<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\ReservedCommands;

use App\Bus\Contracts\CommandBus;
use App\Hooks\Commands\ReleaseInstruction;

/**
 * A caller that hands an already built reserved command to the bus, which the reserved commands check refuses.
 */
final readonly class PassesOneOn
{
    public function __construct(private CommandBus $commands) {}

    public function send(ReleaseInstruction $release): void
    {
        $this->commands->run($release);
    }
}
