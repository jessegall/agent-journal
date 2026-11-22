<?php

declare(strict_types=1);

namespace App\Commands\OpenTerminalView;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalViews;

final readonly class OpenTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    public function handle(OpenTerminalViewCommand $command): string
    {
        $viewer = ActorIdentity::of($command->dispatchedBy());

        return $this->views->open(
            $command->agentId,
            $viewer,
            $command->intervalMs,
            $command->openRequestId,
            $this->clock->now(),
        );
    }
}
