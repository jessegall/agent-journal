<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CheckTerminalScreen;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\TerminalControls;

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
