<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelPrivateEntry;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class CancelPrivateEntryHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CancelPrivateEntryCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->cancelPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $this->clock->now(),
        );
    }
}
