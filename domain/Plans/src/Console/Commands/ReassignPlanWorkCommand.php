<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;
use App\Values\CommandReport;
use Domain\Plans\Calls\ReassignPlanWorkCall;
use Domain\Plans\Console\Concerns\ReportsPlanWork;
use Illuminate\Console\Command;

/**
 * Move a plan or phase and all its unfinished work to another holder, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReassignPlanWorkCommand extends Command
{
    use ReportsPlanWork;
    use RunsCallPipelines;

    protected $signature = 'plan:reassign-work
        {type : plans.plan or plans.phase}
        {id : The plan or phase number, or its id}
        {--plan= : The plan number a phase number is counted in}
        {--assignment= : The root assignment row id it has now}
        {--holder= : The root holder now as type:id}
        {--to= : The new holder as type:id}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Move a plan or phase and all its unfinished work to another holder';

    public function handle(): int
    {
        try {
            $call = ReassignPlanWorkCall::from([
                'rootType' => (string) $this->argument('type'),
                'rootId' => (string) $this->argument('id'),
                'rootPlan' => $this->option('plan') === null ? null : (string) $this->option('plan'),
                'assignmentId' => (string) $this->option('assignment'),
                ...ActorIdentity::fromText((string) $this->option('holder'))->asFields('holder'),
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
