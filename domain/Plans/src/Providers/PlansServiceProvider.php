<?php

declare(strict_types=1);

namespace Domain\Plans\Providers;

use App\Access\Contracts\ReadEntitlements;
use App\Access\Values\ReadEntitlement;
use App\Records\Contracts\RecordSummaries;
use App\Support\Codebase;
use App\Time\Contracts\VerificationTiming;
use Domain\Plans\Contracts\PlanDetailsResolver as PlanDetailsResolverContract;
use Domain\Plans\Contracts\PlanResolver as PlanResolverContract;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Resolvers\PlanDetailsResolver;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Support\PhaseTiming;
use Domain\Plans\Support\PlanSummaries;
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
        $this->app->scoped(PlanResolverContract::class, PlanResolver::class);
        $this->app->scoped(PlanDetailsResolverContract::class, PlanDetailsResolver::class);
        $this->app->scoped(VerificationTiming::class, PhaseTiming::class);
    }

    public function boot(
        ExceptionHandler $exceptions,
        ReadEntitlements $reads,
        RecordSummaries $summaries,
    ): void {
        $readGrant = ReadEntitlement::grant(PlanPolicy::class);

        $summaries->register(Plan::linkType(), PlanSummaries::class);
        $reads->declare('plans_read', $readGrant);
        $reads->declare('plans_list', $readGrant);
        $reads->declare('plans_assigned', $readGrant);
        $reads->declare('phases_read', $readGrant);

        // A missing plan is not found; a refused start is a form error on the start button.
        if ($exceptions instanceof Handler) {
            $exceptions->map(
                PlanMissing::class,
                fn (PlanMissing $missingPlan) => new NotFoundHttpException(previous: $missingPlan),
            );

            $exceptions->renderable(fn (StartDenied $denied) => $this->app->make(Redirector::class)
                ->back(303)
                ->withErrors(['start' => $denied->getMessage()]));
        }

        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands(Codebase::consoleCommandsIn(dirname(__DIR__)));

    }
}
