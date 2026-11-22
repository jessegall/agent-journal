<?php

declare(strict_types=1);

namespace App\Commands\SubmitPrivateInput;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

final readonly class SubmitPrivateInputHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(SubmitPrivateInputCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->submitPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->submission,
            $this->clock->now(),
        );
    }
}
