<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\TakeTerminalControl;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class TakeTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(TakeTerminalControl $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->take(
            $command->agentId,
            $writer,
            $command->readInterestId,
            $command->takeId,
            $this->clock->now(),
        );
    }
}
