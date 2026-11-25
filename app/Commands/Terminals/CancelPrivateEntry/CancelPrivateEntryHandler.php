<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CancelPrivateEntry;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\ActorReference;
use App\Support\TerminalControls;

final readonly class CancelPrivateEntryHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CancelPrivateEntryCommand $command): string
    {
        $writer = ActorReference::of($command->dispatchedBy());

        return $this->controls->cancelPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $this->clock->now(),
        );
    }
}
