<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Admission\AskAdmission;
use App\Contracts\Asks\AskReader;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Processes\SupervisorDefinitions;
use App\Contracts\Processes\SupervisorDispatch;
use App\Enums\Agents\AccessType;
use App\Policies\AskPolicy;
use App\Policies\SupervisorPolicy;
use App\Support\AdvanceDueAsksOnTick;
use App\Support\AskTypeRegistry;
use App\Support\CurrentAskAdmission;
use App\Support\EngineListenerSet;
use App\Support\Readers\AskRecords;
use App\Support\SupervisorRouting;
use App\Support\Types\QuestionAskType;
use App\Support\Types\StuckType;
use App\Support\UnavailableSupervisorDispatch;
use App\Values\AskTypeKey;
use App\Values\PolicyDefinition;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\ServiceProvider;

final class SupervisionServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(SupervisorDefinitions::class, SupervisorRouting::class);
        $this->app->bind(AskAdmission::class, CurrentAskAdmission::class);
        $this->app->bind(AskReader::class, AskRecords::class);
        $this->app->singleton(AskTypeRegistry::class);
        $this->app->bindIf(SupervisorDispatch::class, UnavailableSupervisorDispatch::class);
    }

    public function boot(
        PolicyCatalogue $policies,
        AskTypeRegistry $types,
        Repository $config,
        EngineListenerSet $engineListeners,
    ): void {
        $engineListeners->add(AdvanceDueAsksOnTick::class);
        $this->loadCoreRoutes('supervision/asks.php');

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('asks:recover-delivery')->everyMinute()->withoutOverlapping(),
        );

        $policies->register('Core', new PolicyDefinition(
            SupervisorPolicy::class,
            [AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            AskPolicy::class,
            [AccessType::Edit],
        ));

        $types->register($this->app->make(QuestionAskType::class));
        $types->register($this->app->make(StuckType::class));
        $this->requireKnownAskTypes($types, $config->array('profiles.profiles'));

    }

    /**
     * @param  array<string, mixed>  $profiles
     */
    private function requireKnownAskTypes(AskTypeRegistry $types, array $profiles): void
    {
        foreach ($profiles as $profile) {
            $routes = is_array($profile) ? ($profile['supervisor'] ?? null) : null;

            if (! is_array($routes)) {
                continue;
            }

            foreach (array_diff_key($routes, [AskTypeKey::DEFAULT_ROUTE => true]) as $key => $target) {
                $types->get(AskTypeKey::of($key));
            }
        }
    }
}
