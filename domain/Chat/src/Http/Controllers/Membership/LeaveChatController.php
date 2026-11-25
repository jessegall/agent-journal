<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorIdentity;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The viewer leaves a group chat.
 */
final readonly class LeaveChatController
{
    public function __invoke(
        ChatInput $input,
        PairChats $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->attached($input->inboxId);
        $commands->run(new LeaveInboxCommand($input->inboxId, ActorIdentity::of($actors->actor())));

        return $redirect->back(303);
    }
}
