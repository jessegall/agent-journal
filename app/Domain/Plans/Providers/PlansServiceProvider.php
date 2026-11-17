<?php

declare(strict_types=1);

namespace App\Domain\Plans\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Plans's own models.
 */
final class PlansServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'plans.plan' => Plan::class,
            'plans.phase' => Phase::class,
        ]);
    }
}
