<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\RenewTerminalView;
use App\Agents\Support\TerminalViewReceipt;
use App\Agents\Support\TerminalViews;
use App\Contracts\CommandHandler;

final readonly class RenewTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalView $command): TerminalViewReceipt
    {
        $viewer = ActorIdentity::of($command->dispatchedBy());

        return $this->views->renew($command->agentId, $viewer, $command->intervalMs, $this->clock->now());
    }
}
