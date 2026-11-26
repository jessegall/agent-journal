<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CheckTerminalScreen;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class CheckTerminalScreenHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CheckTerminalScreenCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->check($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
