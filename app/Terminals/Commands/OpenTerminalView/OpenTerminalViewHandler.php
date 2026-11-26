<?php

declare(strict_types=1);

namespace App\Terminals\Commands\OpenTerminalView;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalViewCloser;
use App\Time\Contracts\ServerClock;

final readonly class OpenTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(OpenTerminalViewCommand $command): string
    {
        $viewer = $command->dispatchedBy();

        return $this->views->open(
            $command->agentId,
            $viewer,
            $command->intervalMs,
            $command->openRequestId,
            $this->clock->now(),
        );
    }
}
