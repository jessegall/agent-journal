<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Bus\RequestSource;
use App\Contracts\Chat\AgentMessageReader;
use App\Contracts\Chat\ChatDepartures;
use App\Contracts\Chat\ChatInboxStore;
use App\Contracts\Chat\ChatLines;
use App\Contracts\Chat\ChatMemberPolicies;
use App\Contracts\Chat\ChatTimeline;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxIntervalWriter;
use App\Contracts\Chat\InboxNotices as InboxNoticesContract;
use App\Contracts\Chat\InboxRegistration;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Chat\Notifications;
use App\Contracts\Chat\NotificationTargets;
use App\Contracts\Records\RecordProviderRegistration;
use App\Contracts\Work\IncomingWorkRegistration;
use App\Enums\AccessType;
use App\Enums\AssignmentPurpose;
use App\Models\Messages\Message;
use App\Policies\MessageAdministrationPolicy;
use App\Policies\MessagePolicy;
use App\Resolvers\AgentMessages;
use App\Resolvers\MessageRecords;
use App\Resolvers\QuestionNotificationTarget;
use App\Resolvers\Support\IntervalChatTimeline;
use App\Support\ChatInboxes;
use App\Support\InboxIntervals;
use App\Support\InboxNotices;
use App\Support\IntervalChatDepartures;
use App\Support\Links\MessageLinkRecords;
use App\Support\LinkTypeRegistry;
use App\Support\MessageAnswerActivation;
use App\Support\MessageBatchService;
use App\Support\MessageClaimProvider;
use App\Support\NotificationChangePruning;
use App\Support\NotificationTargetRegistry;
use App\Support\PendingInboxWork;
use App\Support\PendingWorkSources;
use App\Support\ReceiptDeliveries;
use App\Support\RecipientNotifications;
use App\Support\RegisteredInboxes;
use App\Support\SelectedMessages;
use App\Support\SystemEntryPolicies;
use App\Support\TimelineChatLines;
use App\Values\AnswerBudget;
use App\Values\PolicyDefinition;
use App\Values\ReadEntitlement;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\ServiceProvider;

/**
 * Core's messaging between actors: the message as a numbered, linkable record.
 */
final class CommunicationServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->singleton(InboxRegistration::class, RegisteredInboxes::class);
        $this->app->singleton(InboxResolver::class, RegisteredInboxes::class);
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->scoped(ConversationResolver::class, MessageRecords::class);
        $this->app->scoped(ChatLines::class, TimelineChatLines::class);
        $this->app->bind(InboxNoticesContract::class, InboxNotices::class);
        $this->app->bind(ChatDepartures::class, IntervalChatDepartures::class);
        $this->app->bind(ChatInboxStore::class, ChatInboxes::class);
        $this->app->bind(InboxIntervalWriter::class, InboxIntervals::class);
        $this->app->bind(ChatTimeline::class, IntervalChatTimeline::class);
        $this->app->scoped(AgentMessageReader::class, AgentMessages::class);
        $this->app->scoped(RequestSource::class, SelectedMessages::class);
        $this->app->singleton(NotificationTargetRegistry::class);
        $this->app->singleton(NotificationTargets::class, NotificationTargetRegistry::class);
        $this->app->bind(Notifications::class, RecipientNotifications::class);

        $this->app->singleton(AnswerBudget::class, fn () => new AnswerBudget(
            $this->app->make('config')->integer('hooks.answer_budget'),
        ));
    }

    public function boot(
        LinkTypeRegistry $links,
        RecordProviderRegistration $records,
        PolicyCatalogue $policies,
        AssignmentRegistration $assignments,
        PendingWorkSources $pendingWork,
        IncomingWorkRegistration $incoming,
        SystemEntryPolicies $system,
        ReadEntitlements $reads,
        NotificationTargetRegistry $notificationTargets,
        ChatMemberPolicies $chatMembers,
    ): void {
        $chatMembers->allow(MessagePolicy::class);
        $readGrant = ReadEntitlement::grant(MessagePolicy::class);

        $reads->declare('messages_show', $readGrant);
        $reads->declare('messages_read', $readGrant);
        $reads->declare('messages_list', $readGrant);
        $reads->declare('messages_context', $readGrant);
        $reads->declare('inbox_history', $readGrant);
        $reads->declare('inbox_counts', $readGrant);
        $reads->declare('attachments_read', $readGrant);
        $system->allow(InboxNotices::SYSTEM_ENTRY, MessagePolicy::class);

        $policies->register('Core', new PolicyDefinition(
            MessagePolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            MessageAdministrationPolicy::class,
            [AccessType::Read, AccessType::Edit],
        ));

        $links->register([Message::LINK_TYPE => Message::class]);
        $pendingWork->register(PendingInboxWork::class);
        $notificationTargets->register(QuestionNotificationTarget::KEY, QuestionNotificationTarget::class);

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (NotificationChangePruning $pruning) => $pruning->prune(CarbonImmutable::now()))
                ->hourly(),
        );

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (ReceiptDeliveries $deliveries) => $deliveries->deliverDue(CarbonImmutable::now()))
                ->everyMinute(),
        );

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (MessageBatchService $sweep) => $sweep->sweep(CarbonImmutable::now()))
                ->everyMinute(),
        );

        $this->loadCoreRoutes('communication/communication.php');
        $incoming->register(MessageAnswerActivation::class);
        $assignments->registerOwner('Communication', []);

        $assignments->registerRecord(
            Message::LINK_TYPE,
            MessageClaimProvider::class,
            'Communication',
            AssignmentPurpose::InternalResponsibility,
        );

        $records->register(Message::LINK_TYPE, MessageLinkRecords::class);
    }
}
