<?php

declare(strict_types=1);

namespace App\Commands\Agents\RefuseAccountStarts;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Sessions\StartRefusalReason;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\StartHeartbeats;

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
