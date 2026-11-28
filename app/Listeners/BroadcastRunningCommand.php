<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\RunningToolChanged;
use App\Events\Web\RunningCommandChanged;
use App\Models\Access\User;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use App\Web\Data\RunningCommandData;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Sends each change of an agent's chat line to the users who share a chat with the agent, one message per user
 * however many chats they share; an agent in no chat with a user sends nothing.
 */
final readonly class BroadcastRunningCommand implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RunningToolChanged $change): void
    {
        $inboxIds = array_values(array_map(strval(...), InboxMember::query()
            ->active()
            ->ofActor(ActorReference::forAgent($change->agentId))
            ->pluck('inbox_id')
            ->all()));

        $userIds = array_map(
            fn (ActorReference $user) => $user->id,
            InboxMember::resolveAttachedTo($inboxIds, User::class),
        );

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new RunningCommandChanged($userIds, RunningCommandData::from($change)));
    }
}
