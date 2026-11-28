<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\AskAdmission;
use App\Access\Contracts\AskAdmission as AskAdmissionContract;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Asks\AdvanceDueAsksOnTick;
use App\Asks\AskSubjectResolver;
use App\Asks\AskTypeRegistry;
use App\Asks\Contracts\AskReader as AskReaderContract;
use App\Asks\SupervisorDefinitions;
use App\Asks\UnavailableSupervisorDispatch;
use App\Concerns\LoadsCoreRoutes;
use App\Engine\EngineListenerSet;
use App\Policies\AskPolicy;
use App\Policies\SupervisorPolicy;
use App\Processes\Contracts\SupervisorDefinitions as SupervisorDefinitionsContract;
use App\Processes\Contracts\SupervisorDispatch;
use App\Processes\Readers\AskReader;
use App\Support\Types\BuiltInAskType;
use App\Values\AskTypeKey;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\ServiceProvider;

final class SupervisionServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(SupervisorDefinitionsContract::class, SupervisorDefinitions::class);
        $this->app->bind(AskAdmissionContract::class, AskAdmission::class);
        $this->app->bind(AskReaderContract::class, AskReader::class);
        $this->app->singleton(AskTypeRegistry::class);
        $this->app->bindIf(SupervisorDispatch::class, UnavailableSupervisorDispatch::class);
    }

    public function boot(
        PolicyCatalogue $policies,
        AskTypeRegistry $types,
        Repository $config,
        EngineListenerSet $engineListeners,
        AskSubjectResolver $subjects,
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

        $types->register(BuiltInAskType::question($subjects));
        $types->register(BuiltInAskType::stuck($subjects));
        $this->requireKnownAskTypes($types, $config->array('journal.profiles.profiles'));

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
