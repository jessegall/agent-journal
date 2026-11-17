<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console;

use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\Core\AgentRequests\Contracts\AgentRequestSender;
use App\Core\Assignments\Console\Concerns\ReadsAssignmentArguments;
use Illuminate\Console\Command;

/**
 * Release one record from the holder it has now, over a signed call as the agent of the launch.
 */
final class UnassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use SendsSignedCalls;

    protected $signature = 'assignment:unassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as kind:id} {--json}';

    protected $description = 'Release one record from the holder it has now';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = [...$this->recordFields(), 'assignmentId' => (int) $this->option('assignment'), ...ActorIdentity::fromText((string) $this->option('holder'))->asFields('holder')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/assignments/unassign', $body);
    }
}
