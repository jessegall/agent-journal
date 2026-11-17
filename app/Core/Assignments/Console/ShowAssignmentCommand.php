<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console;

use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\Core\AgentRequests\Contracts\AgentRequestSender;
use App\Core\Assignments\Console\Concerns\ReadsAssignmentArguments;
use Illuminate\Console\Command;

/**
 * Show who holds one record and its assignment reference, over a signed call as the agent of the launch.
 */
final class ShowAssignmentCommand extends Command
{
    use ReadsAssignmentArguments;
    use SendsSignedCalls;

    protected $signature = 'assignment:show {type} {id} {--json}';

    protected $description = 'Show who holds one record and its assignment reference';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = $this->recordFields();
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/assignments/show', $body);
    }
}
