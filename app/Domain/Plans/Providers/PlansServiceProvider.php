<?php

declare(strict_types=1);

namespace App\Domain\Plans\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\PlanRecords;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Plans's own models and binds the plan reader.
 */
final class PlansServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(PlanReader::class, PlanRecords::class);
    }

    public function boot(LinkTypes $links): void
    {
        $links->register([
            Plan::LINK_TYPE => Plan::class,
            Phase::LINK_TYPE => Phase::class,
        ]);
    }
}
