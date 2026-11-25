<?php

declare(strict_types=1);

namespace App\Commands\Terminals\TakeTerminalControl;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorReference;
use App\Support\TerminalControls;

final readonly class TakeTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(TakeTerminalControlCommand $command): string
    {
        $writer = ActorReference::of($command->dispatchedBy());

        return $this->controls->take(
            $command->agentId,
            $writer,
            $command->readInterestId,
            $command->takeId,
            $this->clock->now(),
        );
    }
}
