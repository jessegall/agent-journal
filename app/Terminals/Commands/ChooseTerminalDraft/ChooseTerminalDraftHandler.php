<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ChooseTerminalDraft;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class ChooseTerminalDraftHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(ChooseTerminalDraftCommand $command): string
    {
        $writer = $command->dispatchedBy();

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
