<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\ReadEntitlements;
use App\Access\Values\PolicyDefinition;
use App\Access\Values\ReadEntitlement;
use App\Actors\ActorProvisioning;
use App\Actors\Contracts\ActorInboxResolver as ActorInboxResolverContract;
use App\Actors\Contracts\ActorProvisioning as ActorProvisioningContract;
use App\Actors\Contracts\ActorTypes;
use App\Agents\AgentNotices;
use App\Agents\Contracts\AgentNotices as AgentNoticesContract;
use App\Agents\Enums\AccessType;
use App\Assignments\AssigneeDefinition;
use App\Assignments\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentDestinationResolver as AssignmentDestinationResolverContract;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\SharedHolders as SharedHoldersContract;
use App\Assignments\DestinationRegistry;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\InstallInboxesCommand;
use App\Engine\EngineListenerSet;
use App\Inboxes\ActorInboxResolver;
use App\Inboxes\Contracts\InboxDestinationResolver as InboxDestinationResolverContract;
use App\Inboxes\Contracts\InboxMemberPolicies;
use App\Inboxes\Contracts\InboxMemberRoutes;
use App\Inboxes\Contracts\InboxRegistration;
use App\Inboxes\Contracts\InboxResolver;
use App\Inboxes\Contracts\MainInbox as MainInboxContract;
use App\Inboxes\CoreInboxes;
use App\Inboxes\InboxAssignees;
use App\Inboxes\MainInbox;
use App\Inboxes\RegisteredInboxes;
use App\Inboxes\SharedHolders;
use App\Links\MessageLinkRecords;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Notifications;
use App\Notifications\Contracts\Notifications as NotificationsContract;
use App\Notifications\Contracts\NotificationTargets as NotificationTargetsContract;
use App\Notifications\NotificationChangeRetentionService;
use App\Notifications\NotificationTargets;
use App\Policies\MessageAdministrationPolicy;
use App\Policies\MessagePolicy;
use App\Processes\Contracts\RunClaims as RunClaimsContract;
use App\Processes\RunClaims;
use App\Records\Contracts\RecordProviderRegistration;
use App\Stacks\Values\AnswerBudget;
use App\Support\ActorDestinationProvider;
use App\Support\InboxDestinationProvider;
use App\Support\InboxDestinationResolver;
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
            [AccessType::Read, AccessType::Create, AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            MessageAdministrationPolicy::class,
            [AccessType::Read, AccessType::Edit],
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
