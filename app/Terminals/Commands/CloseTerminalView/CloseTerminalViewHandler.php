<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CloseTerminalView;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalViewCloser;
use App\Time\Contracts\ServerClock;

final readonly class CloseTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(CloseTerminalViewCommand $command): void
    {
        $viewer = $command->dispatchedBy();

        $this->views->close($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
