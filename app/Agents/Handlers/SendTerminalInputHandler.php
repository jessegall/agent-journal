<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\SendTerminalInput;
use App\Agents\Data\TerminalControlData;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class SendTerminalInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SendTerminalInput $command): TerminalControlData
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->input(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->input,
            $this->clock->now(),
        );
    }
}
