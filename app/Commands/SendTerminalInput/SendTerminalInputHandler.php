<?php

declare(strict_types=1);

namespace App\Commands\SendTerminalInput;

use App\Contracts\CommandHandler;
use App\Contracts\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

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
