<?php

declare(strict_types=1);

namespace App\Terminals\Commands\TakeTerminalControl;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class TakeTerminalControlHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(TakeTerminalControlCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->take(
            $command->agentId,
            $writer,
            $command->readInterestId,
            $command->takeId,
            $this->clock->now(),
        );
    }
}
