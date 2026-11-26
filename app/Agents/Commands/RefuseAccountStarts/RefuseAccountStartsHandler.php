<?php

declare(strict_types=1);

namespace App\Agents\Commands\RefuseAccountStarts;

use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\StartRefusalReason;
use App\Sessions\StartHeartbeats;

final readonly class RefuseAccountStartsHandler implements CommandHandler
{
    public function __construct(private StartHeartbeats $heartbeats) {}

    public function handle(RefuseAccountStartsCommand $command): void
    {
        $owner = HostProcess::findLocked($command->ownerProcessId);
        $refusal = StartRefusalReason::NotSignedIn->explanation();

        foreach (SessionProcess::findLockedOnAccountOf($owner->sessionProcess()->sole(), $owner->host_id) as $start) {
            $this->heartbeats->refuseStart($start, $refusal);
        }
    }
}
