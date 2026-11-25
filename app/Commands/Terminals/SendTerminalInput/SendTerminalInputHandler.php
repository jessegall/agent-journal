<?php

declare(strict_types=1);

namespace App\Commands\Terminals\SendTerminalInput;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorReference;
use App\Support\TerminalControls;

final readonly class SendTerminalInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SendTerminalInputCommand $command): string
    {
        $writer = ActorReference::of($command->dispatchedBy());

        return $this->controls->input(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->input,
            $this->clock->now(),
        );
    }
}
