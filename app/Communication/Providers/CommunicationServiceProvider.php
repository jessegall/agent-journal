<?php

declare(strict_types=1);

namespace App\Communication\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Support\SystemEntryPolicies;
use App\Actors\Values\PolicyDefinition;
use App\Actors\Values\ReadEntitlement;
use App\Agents\Contracts\RequestSource;
use App\Agents\Support\PendingWorkSources;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Autoload\Support\FolderClasses;
use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\InboxNotices as InboxNoticesContract;
use App\Communication\Contracts\InboxRegistration;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\Notifications;
use App\Communication\Contracts\NotificationTargets;
use App\Communication\Links\MessageLinkRecords;
use App\Communication\Models\Message;
use App\Communication\Policies\MessageAdministrationPolicy;
use App\Communication\Policies\MessagePolicy;
use App\Communication\Resolvers\AgentMessages;
use App\Communication\Resolvers\MessageRecords;
use App\Communication\Resolvers\QuestionNotificationTarget;
use App\Communication\Support\InboxNotices;
use App\Communication\Support\MessageAnswerActivation;
use App\Communication\Support\MessageClaimProvider;
use App\Communication\Support\NotificationTargetRegistry;
use App\Communication\Support\PendingInboxWork;
use App\Communication\Support\RecipientNotifications;
use App\Communication\Support\RegisteredInboxes;
use App\Communication\Support\SelectedMessages;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Contracts\NumberedModelRegistration;
use App\Numbers\Support\NumberedModel;
use App\Operations\Enums\AccessType;
use App\Records\Contracts\RecordProviderRegistration;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Core's messaging between actors: the message as a numbered, linkable record.
 */
final class CommunicationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->singleton(InboxRegistration::class, RegisteredInboxes::class);
        $this->app->singleton(InboxResolver::class, RegisteredInboxes::class);
        $this->app->singleton(RegisteredInboxes::class);
        $this->app->scoped(ConversationResolver::class, MessageRecords::class);
        $this->app->bind(InboxNoticesContract::class, InboxNotices::class);
        $this->app->scoped(AgentMessageReader::class, AgentMessages::class);
        $this->app->scoped(RequestSource::class, SelectedMessages::class);
        $this->app->singleton(NotificationTargetRegistry::class);
        $this->app->singleton(NotificationTargets::class, NotificationTargetRegistry::class);
        $this->app->bind(Notifications::class, RecipientNotifications::class);
    }

    public function boot(
        LinkTypeRegistry $links,
        RecordProviderRegistration $records,
        NumberedModelRegistration $numbers,
        PolicyCatalogue $policies,
        AssignmentRegistration $assignments,
        PendingWorkSources $pendingWork,
        IncomingWorkRegistration $incoming,
        SystemEntryPolicies $system,
        ReadEntitlements $reads,
        NotificationTargetRegistry $notificationTargets,
    ): void {
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
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/communication.php');
        $incoming->register(MessageAnswerActivation::class);
        $assignments->registerOwner('Communication', []);

        $assignments->registerRecord(
            Message::LINK_TYPE,
            MessageClaimProvider::class,
            'Communication',
            AssignmentPurpose::InternalResponsibility,
        );

        $records->register(Message::LINK_TYPE, MessageLinkRecords::class);
        $numbers->register(NumberedModel::global(Message::class));
    }
}
