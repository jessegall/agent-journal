<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CloseTerminalView;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorReference;
use App\Support\TerminalViewCloser;

final readonly class CloseTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(CloseTerminalViewCommand $command): void
    {
        $viewer = ActorReference::of($command->dispatchedBy());

        $this->views->close($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
