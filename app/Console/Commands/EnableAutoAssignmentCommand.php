<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Assignments\Api\EnableAutoAssignmentPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\ReadsAutoAssignmentChange;
use Illuminate\Console\Command;

/**
 * Turn an actor's auto-assignment of one type on, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class EnableAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentChange;

    protected $signature = 'assignment:auto-enable {actor : The actor as type:id}
        {type : The record type, such as tasks.task}
        {--pool= : The pool key, such as tasks.open} {--task=* : A task number the pool lists, in order}
        {--plan= : The plan number the pool is about} {--size=1 : How many items to keep in hand}
        {--revision=0 : The revision read last}
        {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Turn an actor\'s auto-assignment of one record type on';

    public function handle(): int
    {
        return $this->runChange(EnableAutoAssignmentPayload::from(...));
    }
}
