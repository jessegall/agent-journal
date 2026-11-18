<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Assignments\Console\Concerns\ReadsAutoAssignmentChange;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Turn an actor's auto-assignment of one type on, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Write)]
final class EnableAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentChange;
    use SendsSignedWrites;

    protected $signature = 'assignment:auto-enable {actor : The actor as type:id}
        {type : The record type, such as tasks.task}
        {--pool= : The pool key, such as tasks.open} {--task=* : A task number the pool lists, in order}
        {--plan= : The plan number the pool is about} {--size=1 : How many items to keep in hand}
        {--revision=0 : The revision read last}
        {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Turn an actor\'s auto-assignment of one record type on';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = $this->changeFields((int) $this->option('size'));
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendWriteAndPrint($journal, '/agent/assignments/auto/enable', $body);
    }
}
