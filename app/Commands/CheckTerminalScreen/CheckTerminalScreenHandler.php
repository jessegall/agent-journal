<?php

declare(strict_types=1);

namespace App\Commands\CheckTerminalScreen;

use App\Contracts\CommandHandler;
use App\Contracts\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

final readonly class CheckTerminalScreenHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CheckTerminalScreenCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->check($command->agentId, $writer, $command->grantId, $this->clock->now());
    }
}
