<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console;

use App\Core\Agents\Console\Concerns\SendsSignedCalls;
use App\Core\Agents\Contracts\AgentRequestSender;
use App\Core\Assignments\Console\Concerns\ReadsAssignmentArguments;
use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;
use Illuminate\Console\Command;

/**
 * Move one record from the holder it has now to another, over a signed call as the agent of the launch.
 */
final class ReassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use SendsSignedCalls;

    protected $signature = 'assignment:reassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as kind:id} {--to= : The new holder as kind:id} {--json}';

    protected $description = 'Move one record from the holder it has now to another';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = [...$this->recordFields(), 'assignmentId' => (int) $this->option('assignment'), ...$this->actorFields('holder', 'holder'), ...$this->actorFields('to', 'recipient')];
        } catch (InvalidAssignmentIdentity $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/assignments/reassign', $body);
    }
}
