<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAutoAssignmentKey;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Show where an actor's auto-assignment of one type stands, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ShowAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentKey;
    use SendsSignedCalls;

    protected $signature = 'assignment:auto-show {actor : The actor as type:id} {type : The record type} {--json}';

    protected $description = 'Show where an actor\'s auto-assignment of one record type stands';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = $this->keyFields();
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/assignments/auto/show', $body);
    }
}
