<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChooseTerminalDraft;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class ChooseTerminalDraftHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(ChooseTerminalDraftCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->choose(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->choice,
            $command->sequence,
            $this->clock->now(),
        );
    }
}
