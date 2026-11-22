<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenPrivateEntry;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\TerminalControls;
use App\Contracts\CommandHandler;

final readonly class OpenPrivateEntryHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(OpenPrivateEntryCommand $command): string
    {
        $writer = ActorIdentity::of($command->dispatchedBy());

        return $this->controls->openPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $command->sequence,
            $this->clock->now(),
        );
    }
}
