<?php

declare(strict_types=1);

namespace App\Supervision\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use App\Hooks\Events\StateTypesRequested;
use App\Profiles\Contracts\SupervisorDefinitions;
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Enums\AskAbility;
use App\Supervision\Enums\SupervisorAbility;
use App\Supervision\Models\Ask;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Policies\SupervisorPolicy;
use App\Supervision\Readers\AskRecords;
use App\Supervision\States\AnsweringAskState;
use App\Supervision\States\AnsweringAskStates;
use App\Supervision\Support\AskAssignments;
use App\Supervision\Support\AskTypeRegistry;
use App\Supervision\Support\CurrentAskAdmission;
use App\Supervision\Support\SupervisorRouting;
use App\Supervision\Types\CodeReviewType;
use App\Supervision\Types\MergeReadyType;
use App\Supervision\Types\QuestionType;
use App\Supervision\Types\StuckType;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
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
    }

    public function boot(
        PolicyCatalogue $policies,
        AssignmentRegistration $assignments,
        LinkTypeRegistry $links,
        AskTypeRegistry $types,
        Repository $config,
        Dispatcher $events,
    ): void {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/asks.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(AnsweringAskState::TYPE, $this->app->make(AnsweringAskStates::class));
        });
        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('asks:recover-delivery')->everyMinute()->withoutOverlapping(),
        );
        $policies->register('Core', new PolicyRegistration(
            SupervisorLink::class,
            SupervisorPolicy::class,
            SupervisorAbility::class,
            coordinatorOnly: [SupervisorAbility::ChangeRoute],
        ));
        $policies->register('Core', new PolicyRegistration(Ask::class, AskPolicy::class, AskAbility::class));
        $types->register($this->app->make(QuestionType::class));
        $types->register($this->app->make(CodeReviewType::class));
        $types->register($this->app->make(MergeReadyType::class));
        $types->register($this->app->make(StuckType::class));
        $this->requireKnownAskTypes($types, $config->array('profiles.profiles'));

        $links->register([Ask::LINK_TYPE => Ask::class]);
        $assignments->registerOwner('Supervision', []);
        $assignments->registerRecord(
            Ask::LINK_TYPE,
            AskAssignments::class,
            'Supervision',
            AssignmentPurpose::JournalAssigned,
        );
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
