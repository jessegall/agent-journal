<?php

declare(strict_types=1);

namespace Domain\Chat\Providers;

use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Inboxes\InboxMemberRoutes;
use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Notifications\NotificationTargets;
use App\Support\CoreInboxes;
use App\Support\FolderClasses;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockOffers;
use App\Values\ReadEntitlement;
use Domain\Chat\Contracts\PairChats as PairChatsContract;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Resolvers\QuestionNotificationTarget;
use Domain\Chat\Support\AgentDockOffers;
use Domain\Chat\Support\ChatDepartures;
use Domain\Chat\Support\PairChats;
use Domain\Chat\Support\PlacedSources;
use Domain\Questions\Values\QuestionNotificationKeys;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Chat's journal dock commands and their signed routes, and a session that can no longer take a message shown as a
 * form error on Chat's composer.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DockOffers::class, AgentDockOffers::class);
        $this->app->bind(DockedSources::class, PlacedSources::class);
        $this->app->bind(PairChatsContract::class, PairChats::class);
        $this->app->bind(InboxParticipationEnding::class, ChatDepartures::class);
    }

    public function boot(
        ReadEntitlements $reads,
        InboxRegistration $inboxes,
        InboxMemberPolicies $members,
        InboxMemberRoutes $memberRoutes,
        NotificationTargets $notificationTargets,
    ): void {
        $members->allow(MessagePinPolicy::class);
        $memberRoutes->open('chat.');
        $notificationTargets->register(QuestionNotificationKeys::target(), QuestionNotificationTarget::class);
        $inboxes->register(PairChats::PAIR_PROVIDER, CoreInboxes::class);
        $inboxes->register(PairChats::GROUP_PROVIDER, CoreInboxes::class);

        $reads->declare('dock_list', ReadEntitlement::resolver());
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));
    }
}
