<?php

declare(strict_types=1);

namespace App\Domain\Plans\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Plans\Actions\ChangePlanAssignments;
use App\Domain\Plans\Contracts\PlanAssignments;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\PlanRecords;
use Illuminate\Support\ServiceProvider;

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

    public function boot(LinkTypes $links): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $links->register([
            Plan::LINK_TYPE => Plan::class,
            Phase::LINK_TYPE => Phase::class,
        ]);
    }
}
