<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CancelPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;
use App\Time\Contracts\ServerClock;

final readonly class CancelPrivateEntryHandler implements CommandHandler
{
    public function __construct(
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    public function handle(CancelPrivateEntryCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->cancelPrivate(
            $command->agentId,
            $writer,
            $command->grantId,
            $this->clock->now(),
        );
    }
}
