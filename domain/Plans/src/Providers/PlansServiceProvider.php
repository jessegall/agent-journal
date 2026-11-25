<?php

declare(strict_types=1);

namespace Domain\Plans\Providers;

use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Time\VerificationTiming;
use App\Support\FolderClasses;
use App\Support\Sources\Contracts\DockRegistration;
use App\Values\ReadEntitlement;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Resolvers\PlanDetailRecords;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Support\DockedPlan;
use Domain\Plans\Support\PhaseTiming;
use Domain\Plans\Support\PlanDocking;
use Illuminate\Console\Command;
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
        $this->app->scoped(PlanResolver::class, PlanRecords::class);
        $this->app->scoped(PlanDetailsResolver::class, PlanDetailRecords::class);
        $this->app->scoped(VerificationTiming::class, PhaseTiming::class);
    }

    public function boot(
        ExceptionHandler $exceptions,
        ReadEntitlements $reads,
        DockRegistration $docks,
    ): void {
        $readGrant = ReadEntitlement::grant(PlanPolicy::class);

        $docks->offerDockFor($docks->register(Plan::linkType(), DockedPlan::class, PlanDocking::class));
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
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));

    }
}
