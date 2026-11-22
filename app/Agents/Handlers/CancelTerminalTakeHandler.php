<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\CancelTerminalTake;
use App\Agents\Data\TerminalControlData;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class CancelTerminalTakeHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CancelTerminalTake $command): TerminalControlData
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->cancel($command->agentId, $writer, $command->takeId, $this->clock->now());
    }
}
