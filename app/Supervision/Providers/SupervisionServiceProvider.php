<?php

declare(strict_types=1);

namespace App\Supervision\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Profiles\Contracts\SupervisorDefinitions;
use App\Supervision\Enums\SupervisorAbility;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Policies\SupervisorPolicy;
use App\Supervision\Support\SupervisorRouting;
use Illuminate\Support\ServiceProvider;

final class SupervisionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(SupervisorDefinitions::class, SupervisorRouting::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyRegistration(
            SupervisorLink::class,
            SupervisorPolicy::class,
            SupervisorAbility::class,
            coordinatorOnly: [SupervisorAbility::ChangeRoute],
        ));
    }
}
