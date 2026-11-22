<?php

declare(strict_types=1);

namespace App\Commands\RenewTerminalView;

use App\Contracts\CommandHandler;
use App\Contracts\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalViews;

final readonly class RenewTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalViewCommand $command): string
    {
        $viewer = ActorIdentity::of($command->dispatchedBy());

        return $this->views->renew($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
