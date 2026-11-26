<?php

declare(strict_types=1);

namespace App\Terminals\Commands\RenewTerminalControl;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class RenewTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalControlCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->renew($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
