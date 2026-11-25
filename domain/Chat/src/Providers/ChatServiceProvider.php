<?php

declare(strict_types=1);

namespace Domain\Chat\Providers;

use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Notifications\NotificationTargets;
use App\Exceptions\SessionOutdated;
use App\Exceptions\StackTargetRefused;
use App\Support\CoreInboxes;
use App\Support\FolderClasses;
use App\Support\QuestionNotificationKeys;
use App\Support\RefusalReason;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockOffers;
use App\Values\ReadEntitlement;
use Domain\Chat\Contracts\PairChats;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Resolvers\QuestionNotificationTarget;
use Domain\Chat\Support\AgentDockOffers;
use Domain\Chat\Support\ChatDepartures;
use Domain\Chat\Support\ChatInboxes;
use Domain\Chat\Support\PlacedSources;
use Illuminate\Console\Command;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
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
        $this->app->bind(PairChats::class, ChatInboxes::class);
        $this->app->bind(InboxParticipationEnding::class, ChatDepartures::class);
    }

    public function boot(
        ExceptionHandler $exceptions,
        ReadEntitlements $reads,
        InboxRegistration $inboxes,
        InboxMemberPolicies $members,
        NotificationTargets $notificationTargets,
    ): void {
        $members->allow(MessagePinPolicy::class);
        $notificationTargets->register(QuestionNotificationKeys::target(), QuestionNotificationTarget::class);
        $inboxes->register(ChatInboxes::PAIR_PROVIDER, CoreInboxes::class);
        $inboxes->register(ChatInboxes::GROUP_PROVIDER, CoreInboxes::class);

        $reads->declare('dock_list', ReadEntitlement::resolver());
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));

        // A session that can no longer take a message is a form error on the composer, not a failure, with the
        // refusal's stable code flashed beside it; a JSON caller is answered by the shared refusal rendering.
        if ($exceptions instanceof Handler) {
            $exceptions->renderable(
                fn (StackTargetRefused $refused, Request $request) => $this->composerError(
                    $refused,
                    $request,
                    'This agent session cannot take a message now.',
                ),
            );

            $exceptions->renderable(
                fn (SessionOutdated $outdated, Request $request) => $this->composerError(
                    $outdated,
                    $request,
                    'The agent now runs another session. Send the message again to reach it.',
                ),
            );
        }
    }

    private function composerError(CommandRefusal $refusal, Request $request, string $error): RedirectResponse|null
    {
        if ($request->expectsJson()) {
            return null;
        }

        return $this->app->make(Redirector::class)
            ->back(303)
            ->withErrors(['session' => $error])
            ->with(CommandRefusal::CODE_FLASH_KEY, RefusalReason::of($refusal)->code);
    }
}
