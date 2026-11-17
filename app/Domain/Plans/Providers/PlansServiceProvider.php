<?php

declare(strict_types=1);

namespace App\Domain\Plans\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Plans\Actions\ChangePlanAssignments;
use App\Domain\Plans\Console\AssignedPlansCommand;
use App\Domain\Plans\Console\AssignPlanWorkCommand;
use App\Domain\Plans\Console\ReassignPlanWorkCommand;
use App\Domain\Plans\Console\UnassignPlanWorkCommand;
use App\Domain\Plans\Contracts\PlanAssignments;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Exceptions\PlanMissing;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\PlanRecords;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Registers the stable link names of Plans's own models and binds the plan reader and the plan cascades.
 */
final class PlansServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(PlanReader::class, PlanRecords::class);
        $this->app->scoped(PlanAssignments::class, ChangePlanAssignments::class);
    }

    public function boot(LinkTypes $links, ExceptionHandler $exceptions): void
    {
        // A missing plan is not found; a refused start is a form error on the start button.
        if ($exceptions instanceof Handler) {
            $exceptions->map(PlanMissing::class, fn (PlanMissing $missing) => new NotFoundHttpException(previous: $missing));
            $exceptions->renderable(fn (StartDenied $denied) => $this->app->make(Redirector::class)->back(303)->withErrors(['start' => $denied->getMessage()]));
        }

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands([AssignedPlansCommand::class, AssignPlanWorkCommand::class, ReassignPlanWorkCommand::class, UnassignPlanWorkCommand::class]);
        $links->register([
            Plan::LINK_TYPE => Plan::class,
            Phase::LINK_TYPE => Phase::class,
        ]);
    }
}
