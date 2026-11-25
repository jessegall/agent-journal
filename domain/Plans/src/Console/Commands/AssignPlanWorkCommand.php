<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;
use App\Values\CommandReport;
use Domain\Plans\Calls\AssignPlanWorkCall;
use Domain\Plans\Console\Concerns\ReportsPlanWork;
use Illuminate\Console\Command;

/**
 * Give a plan or phase and all its unfinished work to one holder, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignPlanWorkCommand extends Command
{
    use ReportsPlanWork;
    use RunsCallPipelines;

    protected $signature = 'plan:assign-work
        {type : plans.plan or plans.phase}
        {id : The plan or phase number, or its id}
        {--plan= : The plan number a phase number is counted in}
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
                'rootPlan' => $this->option('plan') === null ? null : (string) $this->option('plan'),
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
