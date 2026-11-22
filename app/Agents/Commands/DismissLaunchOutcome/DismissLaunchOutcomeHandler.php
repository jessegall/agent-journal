<?php

declare(strict_types=1);

namespace App\Agents\Commands\DismissLaunchOutcome;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Models\LaunchOutcomeDismissal;
use App\Agents\Models\StartRecord;
use App\Contracts\CommandHandler;

/**
 * Dismisses the outcome the viewer saw: the start must be of an agent the viewer sees, and the version is the one the
 * viewer names, so an outcome that moved on since stays shown.
 */
final readonly class DismissLaunchOutcomeHandler implements CommandHandler
{
    public function __construct(private AgentDirectory $agents) {}

    /**
     * @throws StartRecordMissing
     */
    public function handle(DismissLaunchOutcomeCommand $command): void
    {
        $this->agents->visibleAgent($command->agentId);

        $record = StartRecord::query()
            ->forAgent($command->agentId)
            ->where('request_id', $command->requestId)
            ->firstOr(fn () => throw StartRecordMissing::forRequest($command->requestId));

        LaunchOutcomeDismissal::dismiss(ActorIdentity::of($command->dispatchedBy()), $record, $command->version);
    }
}
