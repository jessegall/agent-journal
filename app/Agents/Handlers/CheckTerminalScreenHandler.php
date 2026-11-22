<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\CheckTerminalScreen;
use App\Agents\Data\TerminalControlData;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class CheckTerminalScreenHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CheckTerminalScreen $command): TerminalControlData
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->check($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
