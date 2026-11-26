<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;
use Domain\Plans\Api\UnassignPlanWorkPayload;
use Domain\Plans\Console\Concerns\ReportsPlanWork;
use Illuminate\Console\Command;

/**
 * Release a plan or phase and all its unfinished work, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class UnassignPlanWorkCommand extends Command
{
    use ReportsPlanWork;
    use RunsApiPipelines;

    protected $signature = 'plan:unassign-work
        {type : plans.plan or plans.phase}
        {id : The plan or phase number, or its id}
        {--plan= : The plan number a phase number is counted in}
        {--assignment= : The root assignment row id it has now}
        {--holder= : The root holder now as type:id}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Release a plan or phase and all its unfinished work';

    public function handle(): int
    {
        try {
            $call = UnassignPlanWorkPayload::from([
                'rootType' => (string) $this->argument('type'),
                'rootId' => (string) $this->argument('id'),
                'rootPlan' => $this->option('plan') === null ? null : (string) $this->option('plan'),
                'assignmentId' => (string) $this->option('assignment'),
                ...ActorReference::fromText((string) $this->option('holder'))->asFields('holder'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runReport(fn () => $this->workReport($this->sendCall($call)));
    }
}
