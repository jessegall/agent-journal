<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RenewTerminalView;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalViewCloser;

final readonly class RenewTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalViewCommand $command): string
    {
        $viewer = ActorIdentity::of($command->dispatchedBy());

        return $this->views->renew($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
