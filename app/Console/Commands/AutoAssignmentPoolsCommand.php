<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Assignments\ListAssignmentPoolsCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * List the pools a record type may be drawn from, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AutoAssignmentPoolsCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'assignment:auto-pools {type : The record type, such as tasks.task} {--json}';

    protected $description = 'List the pools a record type may be drawn from';

    public function handle(): int
    {
        return $this->runCall(ListAssignmentPoolsCall::from(['assignableType' => (string) $this->argument('type')]));
    }
}
