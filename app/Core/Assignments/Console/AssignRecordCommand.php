<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console;

use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Console\Concerns\SendsSignedCalls;
use App\Core\Agents\Contracts\AgentRequestSender;
use App\Core\Assignments\Console\Concerns\ReadsAssignmentArguments;
use Illuminate\Console\Command;

/**
 * Give one record to a holder, over a signed call as the agent of the launch.
 */
final class AssignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use SendsSignedCalls;

    protected $signature = 'assignment:assign {type} {id} {--to= : The new holder as kind:id} {--json}';

    protected $description = 'Give one record to a holder';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = [...$this->recordFields(), ...ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/assignments/assign', $body);
    }
}
