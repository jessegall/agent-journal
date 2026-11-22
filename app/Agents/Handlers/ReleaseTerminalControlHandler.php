<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ReleaseTerminalControl;
use App\Agents\Data\TerminalControlData;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class ReleaseTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(ReleaseTerminalControl $command): TerminalControlData
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->release($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
