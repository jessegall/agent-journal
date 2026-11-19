<?php

declare(strict_types=1);

namespace Domain\Plans\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Plans\Calls\AssignPlanWorkCall;
use Domain\Plans\Console\Concerns\ReportsPlanWork;
use Illuminate\Console\Command;

/**
 * Give a plan or phase and all its unfinished work to one holder, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignPlanWorkCommand extends Command
{
    use ReportsPlanWork;
    use RunsCallPipelines;

    protected $signature = 'plan:assign-work
        {type : plans.plan or plans.phase}
        {id}
        {--to= : The new holder as type:id}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Give a plan or phase and all its unfinished work to one holder';

    public function handle(): int
    {
        try {
            $call = AssignPlanWorkCall::from([
                'rootType' => (string) $this->argument('type'),
                'rootId' => (string) $this->argument('id'),
                ...ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runReport(fn (): CommandReport => $this->workReport($this->sendCall($call)));
    }
}
