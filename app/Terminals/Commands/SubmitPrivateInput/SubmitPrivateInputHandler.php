<?php

declare(strict_types=1);

namespace App\Terminals\Commands\SubmitPrivateInput;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class SubmitPrivateInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SubmitPrivateInputCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->submitPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->submission,
            $this->clock->now(),
        );
    }
}
