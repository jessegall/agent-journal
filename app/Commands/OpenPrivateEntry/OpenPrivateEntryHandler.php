<?php

declare(strict_types=1);

namespace App\Commands\OpenPrivateEntry;

use App\Contracts\CommandHandler;
use App\Contracts\ServerClock;
use App\Support\ActorIdentity;
use App\Support\TerminalControls;

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
