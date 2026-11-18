<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAssignmentArguments;
use Illuminate\Console\Command;

/**
 * Move one record from the holder it has now to another, over a signed call as the agent of the launch.
 */
final class ReassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use SendsSignedCalls;

    protected $signature = 'assignment:reassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as type:id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Move one record from the holder it has now to another';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = [...$this->recordFields(), 'assignmentId' => (string) $this->option('assignment'), ...ActorIdentity::fromText((string) $this->option('holder'))->asFields('holder'), ...ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendWriteAndPrint($journal, '/agent/assignments/reassign', $body);
    }
}
