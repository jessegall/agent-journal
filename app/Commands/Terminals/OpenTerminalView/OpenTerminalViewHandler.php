<?php

declare(strict_types=1);

namespace App\Commands\Terminals\OpenTerminalView;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorReference;
use App\Support\TerminalViewCloser;

final readonly class OpenTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViewCloser $views,
        private ServerClock $clock,
    ) {}

    public function handle(OpenTerminalViewCommand $command): string
    {
        $viewer = ActorReference::of($command->dispatchedBy());

        return $this->views->open(
            $command->agentId,
            $viewer,
            $command->intervalMs,
            $command->openRequestId,
            $this->clock->now(),
        );
    }
}
