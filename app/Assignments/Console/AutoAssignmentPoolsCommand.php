<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * List the pools a record type may be drawn from, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AutoAssignmentPoolsCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'assignment:auto-pools {type : The record type, such as tasks.task} {--json}';

    protected $description = 'List the pools a record type may be drawn from';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/assignments/auto/pools', [
            'assignableType' => (string) $this->argument('type'),
        ]);
    }
}
