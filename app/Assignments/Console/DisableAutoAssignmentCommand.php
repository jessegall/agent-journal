<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAutoAssignmentArguments;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Turn an actor's auto-assignment of one type off, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Write)]
final class DisableAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentArguments;
    use SendsSignedWrites;

    protected $signature = 'assignment:auto-disable {actor : The actor as type:id} {type : The record type}
        {--revision= : The revision read last} {--json}';

    protected $description = 'Turn an actor\'s auto-assignment of one record type off, keeping its pool and size';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = [...$this->keyFields(), 'expectedRevision' => (int) $this->option('revision')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendWriteAndPrint($journal, '/agent/assignments/auto/disable', $body);
    }
}
