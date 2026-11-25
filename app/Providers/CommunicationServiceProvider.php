<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\InstallInboxesCommand;
use App\Contracts\Actors\ActorInboxResolver as ActorInboxResolverContract;
use App\Contracts\Actors\ActorProvisioning as ActorProvisioningContract;
use App\Contracts\Actors\ActorTypes;
use App\Contracts\Agents\AgentNotices as AgentNoticesContract;
use App\Contracts\Assignments\AssignmentDestinationResolver as AssignmentDestinationResolverContract;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Inboxes\InboxDestinationResolver as InboxDestinationResolverContract;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Inboxes\InboxMemberRoutes;
use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Inboxes\InboxResolver;
use App\Contracts\Inboxes\MainInbox as MainInboxContract;
use App\Contracts\Inboxes\MainInboxTakeover as MainInboxTakeoverContract;
use App\Contracts\Notifications\Notifications as NotificationsContract;
use App\Contracts\Notifications\NotificationTargets as NotificationTargetsContract;
use App\Contracts\Processes\RunClaims as RunClaimsContract;
use App\Contracts\Records\RecordProviderRegistration;
use App\Contracts\Sharing\SharedHolders as SharedHoldersContract;
use App\Enums\Agents\AccessType;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Policies\MessageAdministrationPolicy;
use App\Policies\MessagePolicy;
use App\Support\ActorDestinationProvider;
use App\Support\ActorInboxResolver;
use App\Support\ActorProvisioning;
use App\Support\AgentNotices;
use App\Support\AssigneeDefinition;
use App\Support\AssignmentDestinationResolver;
use App\Support\CoreInboxes;
use App\Support\DestinationRegistry;
use App\Support\EngineListenerSet;
use App\Support\InboxAssignees;
use App\Support\InboxDestinationProvider;
use App\Support\InboxDestinationResolver;
use App\Support\Links\MessageLinkRecords;
use App\Support\MainInbox;
use App\Support\MainInboxTakeover;
use App\Support\NotificationChangeRetentionService;
use App\Support\Notifications;
use App\Support\NotificationTargets;
use App\Support\RegisteredInboxes;
use App\Support\RunClaims;
use App\Support\SharedHolders;
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
        $this->app->scoped(ActorProvisioningContract::class, ActorProvisioning::class);
        $this->app->scoped(ActorInboxResolverContract::class, ActorInboxResolver::class);
        $this->app->scoped(RunClaimsContract::class, RunClaims::class);
        $this->app->scoped(MainInboxTakeoverContract::class, MainInboxTakeover::class);
        $this->app->scoped(MainInboxContract::class, MainInbox::class);
        $this->app->scoped(SharedHoldersContract::class, SharedHolders::class);
        $this->app->singleton(DestinationRegistry::class);
        $this->app->scoped(AssignmentDestinationResolverContract::class, AssignmentDestinationResolver::class);
        $this->app->scoped(InboxDestinationResolverContract::class, InboxDestinationResolver::class);
        $this->app->singleton(InboxResolver::class, RegisteredInboxes::class);
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->bind(AgentNoticesContract::class, AgentNotices::class);
        $this->app->singleton(NotificationTargets::class);
        $this->app->singleton(NotificationTargetsContract::class, NotificationTargets::class);
        $this->app->bind(NotificationsContract::class, Notifications::class);

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
        NotificationTargets $notificationTargets,
        InboxMemberPolicies $inboxMembers,
        InboxMemberRoutes $memberRoutes,
        EngineListenerSet $engineListeners,
        ActorTypes $actorTypes,
    ): void {
        $memberRoutes->open('communication.');
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

        $this->app->booted(function () use ($destinations, $actorTypes): void {
            foreach ($actorTypes->types() as $actorType) {
                $destinations->register($actorType, ActorDestinationProvider::class);
            }
        });

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
