<?php

declare(strict_types=1);

namespace Domain\Chat\Providers;

use App\Access\Contracts\ReadEntitlements;
use App\Access\Values\ReadEntitlement;
use App\Inboxes\Contracts\InboxMemberPolicies;
use App\Inboxes\Contracts\InboxMemberRoutes;
use App\Inboxes\Contracts\InboxParticipationEnding;
use App\Inboxes\Contracts\InboxRegistration;
use App\Inboxes\CoreInboxes;
use App\Navigation\Contracts\WindowOffers;
use App\Notifications\Contracts\NotificationTargets;
use App\Providers\TypeScriptServiceProvider;
use App\Support\FolderClasses;
use Domain\Chat\Contracts\Docking\CardEncoder as CardEncoderContract;
use Domain\Chat\Contracts\Docking\DestinationGate as DestinationGateContract;
use Domain\Chat\Contracts\Docking\DockedSources as DockedSourcesContract;
use Domain\Chat\Contracts\Docking\DockRegistration as DockRegistrationContract;
use Domain\Chat\Contracts\Docking\FallbackDocks as FallbackDocksContract;
use Domain\Chat\Contracts\PairChats as PairChatsContract;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Resolvers\QuestionNotificationTarget;
use Domain\Chat\Support\AgentDockOffers;
use Domain\Chat\Support\ChatDepartures;
use Domain\Chat\Support\DockedSources;
use Domain\Chat\Support\Docking\DestinationGate;
use Domain\Chat\Support\Docking\DockedRun;
use Domain\Chat\Support\Docking\DockRegistration;
use Domain\Chat\Support\Docking\FallbackDocks;
use Domain\Chat\Support\Docking\OutputDocking;
use Domain\Chat\Support\Docking\RunDocking;
use Domain\Chat\Support\PairChats;
use Domain\Chat\Support\Wire\CardEncoder;
use Domain\Chat\Support\Wire\DockNodeTypes;
use Domain\Chat\Support\Wire\PartMap;
use Domain\Chat\Values\DockedOutput;
use Domain\Questions\Values\QuestionNotificationKeys;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Chat's journal dock commands and their signed routes, a session that can no longer take a message shown as a form
 * error on Chat's composer, and the docking the chat owns: the registry of dockable types with the process runs and
 * outputs it docks, the card wire and its TypeScript, and Add to chat on every window that shows a record.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(WindowOffers::class, AgentDockOffers::class);
        $this->app->bind(DockedSourcesContract::class, DockedSources::class);
        $this->app->bind(DockRegistrationContract::class, DockRegistration::class);
        $this->app->bind(DestinationGateContract::class, DestinationGate::class);
        $this->app->bind(CardEncoderContract::class, CardEncoder::class);
        $this->app->bind(FallbackDocksContract::class, FallbackDocks::class);
        $this->app->singleton(PartMap::class, PartMap::standard(...));
        $this->app->tag([DockNodeTypes::class], TypeScriptServiceProvider::PROVIDER_TAG);
        $this->app->bind(PairChatsContract::class, PairChats::class);
        $this->app->bind(InboxParticipationEnding::class, ChatDepartures::class);
    }

    public function boot(
        ReadEntitlements $reads,
        InboxRegistration $inboxes,
        InboxMemberPolicies $members,
        InboxMemberRoutes $memberRoutes,
        NotificationTargets $notificationTargets,
        DockRegistrationContract $docks,
    ): void {
        $docks->register(RunDocking::DOCK_TYPE, DockedRun::class, RunDocking::class);
        $docks->register(OutputDocking::DOCK_TYPE, DockedOutput::class, OutputDocking::class);
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
