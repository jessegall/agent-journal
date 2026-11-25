<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Assignments\ConfigureAutoAssignmentCall;
use App\Console\Concerns\ReadsAutoAssignmentChange;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Give an actor's auto-assignment of one type a new pool and size, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ConfigureAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentChange;

    protected $signature = 'assignment:auto-configure {actor : The actor as type:id} {type : The record type}
        {--pool= : The pool key} {--task=* : A task number the pool lists, in order}
        {--plan= : The plan number the pool is about} {--size= : How many items to keep in hand}
        {--revision= : The revision read last}
        {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Give an actor\'s auto-assignment of one record type a new pool and size';

    public function handle(): int
    {
        return $this->runChange(ConfigureAutoAssignmentCall::from(...));
    }
}
