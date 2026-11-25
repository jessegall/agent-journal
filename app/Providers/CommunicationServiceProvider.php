<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\InstallInboxesCommand;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Actors\ActorProvisioning;
use App\Contracts\Agents\AgentNotices;
use App\Contracts\Assignments\AssignmentDestinationResolver;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Inboxes\InboxDestinationResolver;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Inboxes\InboxResolver;
use App\Contracts\Inboxes\MainInbox;
use App\Contracts\Inboxes\MainInboxTakeover;
use App\Contracts\Notifications\Notifications;
use App\Contracts\Notifications\NotificationTargets;
use App\Contracts\Processes\RunClaims;
use App\Contracts\Records\RecordProviderRegistration;
use App\Contracts\Sharing\SharedHolders;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Policies\MessageAdministrationPolicy;
use App\Policies\MessagePolicy;
use App\Support\ActorDestinationProvider;
use App\Support\AssigneeDefinition;
use App\Support\AttachedInboxes;
use App\Support\CoreInboxes;
use App\Support\DestinationRegistry;
use App\Support\EngineListenerSet;
use App\Support\InboxAssignees;
use App\Support\InboxDestinationProvider;
use App\Support\InboxRunClaims;
use App\Support\JournalAgentNotices;
use App\Support\Links\MessageLinkRecords;
use App\Support\MainInboxHandover;
use App\Support\MainInboxNavigation;
use App\Support\NotificationChangeRetentionService;
use App\Support\NotificationTargetRegistry;
use App\Support\PersonalInboxes;
use App\Support\PersonalInboxResolver;
use App\Support\RecipientNotifications;
use App\Support\RegisteredAssignmentDestinations;
use App\Support\RegisteredInboxDestinations;
use App\Support\RegisteredInboxes;
use App\Values\AnswerBudget;
use App\Values\PolicyDefinition;
use App\Values\ReadEntitlement;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\ServiceProvider;

/**
 * Core's messaging between actors: messages, their reads and the inboxes they are sent into.
 */
final class CommunicationServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->singleton(InboxRegistration::class, RegisteredInboxes::class);
        $this->app->scoped(ActorProvisioning::class, PersonalInboxes::class);
        $this->app->scoped(ActorInboxResolver::class, PersonalInboxResolver::class);
        $this->app->scoped(RunClaims::class, InboxRunClaims::class);
        $this->app->scoped(MainInboxTakeover::class, MainInboxHandover::class);
        $this->app->scoped(MainInbox::class, MainInboxNavigation::class);
        $this->app->scoped(SharedHolders::class, AttachedInboxes::class);
        $this->app->singleton(DestinationRegistry::class);
        $this->app->scoped(AssignmentDestinationResolver::class, RegisteredAssignmentDestinations::class);
        $this->app->scoped(InboxDestinationResolver::class, RegisteredInboxDestinations::class);
        $this->app->singleton(InboxResolver::class, RegisteredInboxes::class);
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->bind(AgentNotices::class, JournalAgentNotices::class);
        $this->app->singleton(NotificationTargetRegistry::class);
        $this->app->singleton(NotificationTargets::class, NotificationTargetRegistry::class);
        $this->app->bind(Notifications::class, RecipientNotifications::class);

        $this->app->singleton(AnswerBudget::class, fn () => new AnswerBudget(
            $this->app->make('config')->integer('hooks.answer_budget'),
        ));
    }

    public function boot(
        RecordProviderRegistration $records,
        PolicyCatalogue $policies,
        ReadEntitlements $reads,
        InboxRegistration $inboxes,
        DestinationRegistry $destinations,
        AssignmentRegistration $assignments,
        NotificationTargetRegistry $notificationTargets,
        InboxMemberPolicies $inboxMembers,
        EngineListenerSet $engineListeners,
    ): void {
        $inboxMembers->allow(MessagePolicy::class);
        $readGrant = ReadEntitlement::grant(MessagePolicy::class);

        $reads->declare('messages_read', $readGrant);
        $reads->declare('messages_read_unread', $readGrant);
        $reads->declare('questions_read', $readGrant);
        $reads->declare('messages_list', $readGrant);
        $reads->declare('messages_context', $readGrant);
        $reads->declare('inbox_history', $readGrant);
        $reads->declare('inbox_counts', $readGrant);
        $reads->declare('attachments_read', $readGrant);

        $policies->register('Core', new PolicyDefinition(
            MessagePolicy::class,
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(
            MessageAdministrationPolicy::class,
            [
                AccessType::Read,
                AccessType::Edit,
            ],
        ));

        $inboxes->register(Inbox::NAMED_PROVIDER, CoreInboxes::class);
        $inboxes->register(Inbox::PERSONAL_PROVIDER, CoreInboxes::class);
        $this->commands([InstallInboxesCommand::class]);
        $destinations->register(Inbox::ASSIGNEE_TYPE, InboxDestinationProvider::class);

        foreach (ActorType::cases() as $actorType) {
            $destinations->register($actorType->value, ActorDestinationProvider::class);
        }

        $assignments->registerAssignees(new AssigneeDefinition(Inbox::ASSIGNEE_TYPE, InboxAssignees::class));

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (NotificationChangeRetentionService $pruning) => $pruning->prune(CarbonImmutable::now()))
                ->hourly(),
        );

        $this->loadCoreRoutes('communication/communication.php');
        $records->register(Message::linkType(), MessageLinkRecords::class);
    }
}
