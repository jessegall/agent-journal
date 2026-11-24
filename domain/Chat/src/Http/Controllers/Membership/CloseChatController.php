<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Enums\ActorType;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Support\ChatInboxes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Closes a group chat: every member leaves it; the viewer must manage its members.
 */
final readonly class CloseChatController
{
    public function __invoke(
        ChatInput $input,
        ChatInboxes $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->assertManages($input->inboxId);

        foreach ([...InboxMember::attachedTo([$input->inboxId], ActorType::User), ...InboxMember::attachedTo([$input->inboxId], ActorType::Agent)] as $member) {
            $commands->run(new LeaveInboxCommand($input->inboxId, $member));
        }

        return $redirect->back(303);
    }
}
