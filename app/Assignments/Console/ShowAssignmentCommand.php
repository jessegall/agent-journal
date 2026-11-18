<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAssignmentArguments;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Show who holds one record and its assignment reference, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
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
