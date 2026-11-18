<?php

declare(strict_types=1);

namespace Domain\Plans\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Plans\Console\Concerns\SendsPlanWorkCommands;
use Illuminate\Console\Command;

/**
 * Release a plan or phase and all its unfinished work, over a signed call as the agent of the launch.
 */
final class UnassignPlanWorkCommand extends Command
{
    use SendsPlanWorkCommands;

    protected $signature = 'plan:unassign-work {type : plans.plan or plans.phase} {id} {--assignment= : The root assignment row id it has now} {--holder= : The root holder now as type:id} {--json}';

    protected $description = 'Release a plan or phase and all its unfinished work';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $fields = ['assignmentId' => (int) $this->option('assignment'), ...ActorIdentity::fromText((string) $this->option('holder'))->asFields('holder')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendCascade($journal, 'unassign', $fields);
    }
}
