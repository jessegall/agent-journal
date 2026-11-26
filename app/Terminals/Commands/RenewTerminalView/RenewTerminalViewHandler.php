<?php

declare(strict_types=1);

namespace App\Terminals\Commands\RenewTerminalView;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalViewCloser;
use App\Time\Contracts\ServerClock;

final readonly class RenewTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(RenewTerminalViewCommand $command): string
    {
        $viewer = $command->dispatchedBy();

        return $this->views->renew($command->agentId, $viewer, $command->readInterestId, $this->clock->now());
    }
}
