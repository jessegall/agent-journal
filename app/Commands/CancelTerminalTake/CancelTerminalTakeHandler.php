<?php

declare(strict_types=1);

namespace App\Commands\CancelTerminalTake;

use App\Contracts\CommandHandler;
use App\Contracts\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

final readonly class CancelTerminalTakeHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CancelTerminalTakeCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->cancel($command->agentId, $writer, $command->takeId, $this->clock->now());
    }
}
