<?php

declare(strict_types=1);

namespace App\Sessions\Commands\RecordUserHeartbeat;

use App\Bus\Contracts\CommandHandler;
use App\Models\Presence\UserPresence;
use App\Time\Contracts\ServerClock;

final readonly class RecordUserHeartbeatHandler implements CommandHandler
{
    public function __construct(
        private ServerClock $clock,
    ) {}

    public function handle(RecordUserHeartbeatCommand $command): void
    {
        $now = $this->clock->now();
        UserPresence::create($command->dispatchedBy()->id, $now)->beatAt($now);
    }
}
