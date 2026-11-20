<?php

declare(strict_types=1);

namespace Domain\Plans\Providers;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\ReadEntitlement;
use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use App\Processes\Contracts\VerificationTiming;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Domain\Plans\Resolvers\PlanDetailRecords;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Support\PhaseTiming;
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

    public function boot(LinkTypeRegistry $links, ExceptionHandler $exceptions, ReadEntitlements $reads): void
    {
        $reads->declare('plans_read', ReadEntitlement::grant(PlanPolicy::class));
        $reads->declare('plans_list', ReadEntitlement::grant(PlanPolicy::class));
        $reads->declare('plans_assigned', ReadEntitlement::grant(PlanPolicy::class));
        $reads->declare('phases_read', ReadEntitlement::grant(PlanPolicy::class));

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

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        $links->register([
            Plan::LINK_TYPE => Plan::class,
            Phase::LINK_TYPE => Phase::class,
        ]);
    }
}
