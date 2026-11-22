<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\OpenTerminalView;
use App\Agents\Support\TerminalViewReceipt;
use App\Agents\Support\TerminalViews;
use App\Contracts\CommandHandler;

final readonly class OpenTerminalViewHandler implements CommandHandler
{
    public function __construct(
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    public function handle(OpenTerminalView $command): TerminalViewReceipt
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
