<?php

declare(strict_types=1);

namespace App\Terminals\Commands\SendTerminalInput;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class SendTerminalInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SendTerminalInputCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->input(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->input,
            $this->clock->now(),
        );
    }
}
