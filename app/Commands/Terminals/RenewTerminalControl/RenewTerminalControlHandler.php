<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RenewTerminalControl;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

final readonly class RenewTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalControlCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->renew($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
