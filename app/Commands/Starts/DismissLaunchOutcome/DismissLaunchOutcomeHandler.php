<?php

declare(strict_types=1);

namespace App\Commands\Starts\DismissLaunchOutcome;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\AgentDirectory;
use App\Exceptions\StartRecordMissing;
use App\Models\Starts\LaunchOutcomeDismissal;
use App\Models\Starts\StartRecord;
use App\Support\ActorIdentity;

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
            ->underRequest($command->requestId)
            ->firstOr(StartRecordMissing::throwing()->forRequest($command->requestId));

        LaunchOutcomeDismissal::create(ActorIdentity::of($command->dispatchedBy()), $record, $command->version);
    }
}
