<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\LeaveInbox\LeaveInboxCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Inboxes\InboxMember;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Closes a group chat: every member leaves it; the viewer must manage its members.
 */
final readonly class CloseChatController
{
    #[Dispatches(LeaveInboxCommand::class)]
    public function __invoke(
        ChatInput $input,
        PairChats $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->assertManages($input->inboxId);

        $commands->run(new LeaveInboxCommand($input->inboxId, [
            ...InboxMember::resolveAttachedTo([$input->inboxId], User::class),
            ...InboxMember::resolveAttachedTo([$input->inboxId], Agent::class),
        ]));

        return $redirect->back(303);
    }
}
