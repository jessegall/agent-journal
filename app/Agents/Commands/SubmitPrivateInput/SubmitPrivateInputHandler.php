<?php

declare(strict_types=1);

namespace App\Agents\Commands\SubmitPrivateInput;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

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
