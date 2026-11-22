<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\CloseTerminalView;
use App\Agents\Support\TerminalViews;
use App\Contracts\CommandHandler;

final readonly class CloseTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    public function handle(CloseTerminalView $command): void
    {
        $viewer = ActorIdentity::of($command->dispatchedBy());

        $this->views->close($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
