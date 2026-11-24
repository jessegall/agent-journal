<?php

declare(strict_types=1);

namespace App\Commands\Terminals\ChooseTerminalDraft;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

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
