<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandFacts;
use App\Enums\RecoveryAction;
use App\Events\DriverRequestRecovered;
use App\Exceptions\DriverRequestRefused;
use App\Models\Drivers\DriverRequest;

/**
 * What the three recovery commands share: the request locked at the row version its caller read, and the audit
 * event naming who did what and why.
 */
final readonly class DriverRequestRecovery
{
    public function __construct(private CurrentActor $actors, private CommandFacts $facts) {}

    /**
     * @throws DriverRequestRefused
     */
    public function lockedAt(string $requestId, int $expectedRowVersion): DriverRequest
    {
        $request = DriverRequest::lockedById($requestId);

        if (! $request->isAtRowVersion($expectedRowVersion)) {
            throw DriverRequestRefused::changedSinceRead($requestId, $expectedRowVersion, $request->row_version);
        }

        return $request;
    }

    public function record(DriverRequest $request, RecoveryAction $action, string $reason): int
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $this->facts->publishAfterCommit(new DriverRequestRecovered($request->id, $action, $actor, $reason));

        return $request->row_version;
    }
}
