<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Assignments\ShowAssignmentCall;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Show who holds one record and its assignment reference, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ShowAssignmentCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsCallPipelines;

    protected $signature = 'assignment:show {type} {id} {--json}';

    protected $description = 'Show who holds one record and its assignment reference';

    public function handle(): int
    {
        return $this->runCall(ShowAssignmentCall::from($this->recordFields()));
    }
}
