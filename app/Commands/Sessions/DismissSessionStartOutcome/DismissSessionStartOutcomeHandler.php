<?php

declare(strict_types=1);

namespace App\Commands\Sessions\DismissSessionStartOutcome;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\AgentDirectory;
use App\Exceptions\SessionRequestMissing;
use App\Models\Sessions\SessionOutcomeDismissal;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorReference;

/**
 * Dismisses the outcome the viewer saw: the start must be of an agent the viewer sees, and the version is the one the
 * viewer names, so an outcome that moved on since stays shown.
 */
final readonly class DismissSessionStartOutcomeHandler implements CommandHandler
{
    public function __construct(private AgentDirectory $agents) {}

    /**
     * @throws SessionRequestMissing
     */
    public function handle(DismissSessionStartOutcomeCommand $command): void
    {
        $this->agents->visibleAgent($command->agentId);

        $record = SessionRequest::query()
            ->forAgent($command->agentId)
            ->underRequest($command->requestId)
            ->firstOr(SessionRequestMissing::throwing()->forRequest($command->requestId));

        SessionOutcomeDismissal::create(ActorReference::of($command->dispatchedBy()), $record, $command->version);
    }
}
