<?php

declare(strict_types=1);

namespace App\Supervision\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyDefinition;
use App\Agents\Contracts\MergeAdmission;
use App\Autoload\Support\FolderClasses;
use App\Engine\Support\EngineListenerSet;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use App\Profiles\Contracts\SupervisorDefinitions;
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Contracts\SupervisorDispatch;
use App\Supervision\Contracts\WorkRepair;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Models\AskRequester;
use App\Supervision\Models\SupervisorChange;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Policies\SupervisorPolicy;
use App\Supervision\Readers\AskRecords;
use App\Supervision\Support\AdvanceDueAsksOnTick;
use App\Supervision\Support\AskTypeRegistry;
use App\Supervision\Support\CurrentAskAdmission;
use App\Supervision\Support\HandOffCodeReviewsOnTick;
use App\Supervision\Support\ReviewMergeAdmission;
use App\Supervision\Support\SettleMergeOutcomesOnTick;
use App\Supervision\Support\SupervisorRouting;
use App\Supervision\Support\UnavailableSupervisorDispatch;
use App\Supervision\Support\UnavailableWorkRepair;
use App\Supervision\Types\CodeReviewType;
use App\Supervision\Types\MergeReadyType;
use App\Supervision\Types\QuestionType;
use App\Supervision\Types\StuckType;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\ServiceProvider;

final class SupervisionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(SupervisorDefinitions::class, SupervisorRouting::class);
        $this->app->bind(AskAdmission::class, CurrentAskAdmission::class);
        $this->app->bind(AskReader::class, AskRecords::class);
        $this->app->singleton(AskTypeRegistry::class);
        $this->app->bindIf(SupervisorDispatch::class, UnavailableSupervisorDispatch::class);
        $this->app->bindIf(WorkRepair::class, UnavailableWorkRepair::class);
        // The contract belongs to Agents, which never names Supervision; supervision admits merges.
        $this->app->bind(MergeAdmission::class, ReviewMergeAdmission::class);
    }

    public function boot(
        PolicyCatalogue $policies,
        LinkTypeRegistry $links,
        AskTypeRegistry $types,
        Repository $config,
        EngineListenerSet $engineListeners,
    ): void {
        $engineListeners->add(AdvanceDueAsksOnTick::class);
        $engineListeners->add(HandOffCodeReviewsOnTick::class);
        $engineListeners->add(SettleMergeOutcomesOnTick::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/asks.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
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
        $types->register($this->app->make(QuestionType::class));
        $types->register($this->app->make(CodeReviewType::class));
        $types->register($this->app->make(MergeReadyType::class));
        $types->register($this->app->make(StuckType::class));
        $this->requireKnownAskTypes($types, $config->array('profiles.profiles'));

        $links->register([
            Ask::LINK_TYPE => Ask::class,
            AskHop::LINK_TYPE => AskHop::class,
            AskRequester::LINK_TYPE => AskRequester::class,
            SupervisorChange::LINK_TYPE => SupervisorChange::class,
            SupervisorLink::LINK_TYPE => SupervisorLink::class,
        ]);
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
                $types->get(AskTypeKey::from($key));
            }
        }
    }
}
