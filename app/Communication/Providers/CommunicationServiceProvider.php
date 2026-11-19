<?php

declare(strict_types=1);

namespace App\Communication\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Agents\Support\PendingWorkSources;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Enums\AssignmentPurpose;
use App\Communication\Console\AskMessageCommand;
use App\Communication\Console\DismissMessageCommand;
use App\Communication\Console\InboxCountsCommand;
use App\Communication\Console\InboxHistoryCommand;
use App\Communication\Console\ReadMessagesCommand;
use App\Communication\Console\ReplyToMessageCommand;
use App\Communication\Console\RequireMessageAnswerCommand;
use App\Communication\Console\SendMessageCommand;
use App\Communication\Console\ShowMessageCommand;
use App\Communication\Console\TakeNextMessagesCommand;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\InboxRegistration;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\MemberInboxes;
use App\Communication\Enums\MessageAbility;
use App\Communication\Links\MessageLinkRecords;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Communication\Resolvers\MessageRecords;
use App\Communication\Support\MessageAnswerActivation;
use App\Communication\Support\MessageClaimProvider;
use App\Communication\Support\PendingInboxWork;
use App\Communication\Support\RegisteredInboxes;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Records\Contracts\RecordProviderRegistration;
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
        $this->app->singleton(MemberInboxes::class, RegisteredInboxes::class);
        $this->app->scoped(ConversationResolver::class, MessageRecords::class);
    }

    public function boot(
        LinkTypeRegistry $links,
        RecordProviderRegistration $records,
        NumberedTypeRegistry $numbers,
        PolicyCatalogue $policies,
        AssignmentRegistration $assignments,
        PendingWorkSources $pendingWork,
        IncomingWorkRegistration $incoming,
    ): void {
        $policies->register('Core', new PolicyRegistration(
            Message::class,
            MessagePolicy::class,
            MessageAbility::class,
            ownerOnly: [MessageAbility::Inspect, MessageAbility::Recover],
        ));
        $links->register([Message::LINK_TYPE => Message::class]);
        $pendingWork->register(PendingInboxWork::class);
        $this->commands([
            SendMessageCommand::class,
            AskMessageCommand::class,
            ReplyToMessageCommand::class,
            RequireMessageAnswerCommand::class,
            ReadMessagesCommand::class,
            TakeNextMessagesCommand::class,
            DismissMessageCommand::class,
            ShowMessageCommand::class,
            InboxHistoryCommand::class,
            InboxCountsCommand::class,
        ]);
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
