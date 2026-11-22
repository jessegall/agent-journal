<?php

declare(strict_types=1);

namespace App\Agents\Commands\SendTerminalInput;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class SendTerminalInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SendTerminalInputCommand $command): string
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
