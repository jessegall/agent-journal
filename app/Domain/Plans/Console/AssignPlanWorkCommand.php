<?php

declare(strict_types=1);

namespace App\Domain\Plans\Console;

use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Contracts\AgentRequestSender;
use App\Domain\Plans\Console\Concerns\SendsPlanWorkCommands;
use Illuminate\Console\Command;

/**
 * Give a plan or phase and all its unfinished work to one holder, over a signed call as the agent of the launch.
 */
final class AssignPlanWorkCommand extends Command
{
    use SendsPlanWorkCommands;

    protected $signature = 'plan:assign-work {type : plans.plan or plans.phase} {id} {--to= : The new holder as kind:id} {--json}';

    protected $description = 'Give a plan or phase and all its unfinished work to one holder';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $fields = ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient');
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->sendCascade($journal, 'assign', $fields);
    }
}
