<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAutoAssignmentChange;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Give an actor's auto-assignment of one type a new pool and size, over a signed call as the agent of the launch.
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

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendChange($journal, '/agent/assignments/auto/configure');
    }
}
