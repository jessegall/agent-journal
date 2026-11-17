<?php

declare(strict_types=1);

namespace App\Domain\Plans\Console;

use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\AgentRequests\Contracts\AgentRequestSender;
use App\Domain\Plans\Console\Concerns\SendsPlanWorkCommands;
use Illuminate\Console\Command;

/**
 * Move a plan or phase and all its unfinished work to another holder, over a signed call as the agent of the launch.
 */
final class ReassignPlanWorkCommand extends Command
{
    use SendsPlanWorkCommands;

    protected $signature = 'plan:reassign-work {type : plans.plan or plans.phase} {id} {--assignment= : The root assignment row id it has now} {--holder= : The root holder now as kind:id} {--to= : The new holder as kind:id} {--json}';

    protected $description = 'Move a plan or phase and all its unfinished work to another holder';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $fields = ['assignmentId' => (int) $this->option('assignment'), ...ActorIdentity::fromText((string) $this->option('holder'))->asFields('holder'), ...ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient')];
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendCascade($journal, 'reassign', $fields);
    }
}
