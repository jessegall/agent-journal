<?php

declare(strict_types=1);

namespace App\Commands\ReleaseTerminalControl;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

final readonly class ReleaseTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(ReleaseTerminalControlCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->release($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
