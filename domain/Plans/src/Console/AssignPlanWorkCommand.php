<?php

declare(strict_types=1);

namespace Domain\Plans\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Plans\Console\Concerns\SendsPlanWorkCommands;
use Illuminate\Console\Command;

/**
 * Give a plan or phase and all its unfinished work to one holder, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignPlanWorkCommand extends Command
{
    use SendsPlanWorkCommands;

    protected $signature = 'plan:assign-work {type : plans.plan or plans.phase} {id} {--to= : The new holder as type:id} {--json}';

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
