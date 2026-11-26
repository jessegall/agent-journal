<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\LeaveInbox\LeaveInboxCommand;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The viewer leaves a group chat.
 */
final readonly class LeaveChatController
{
    #[Dispatches(LeaveInboxCommand::class)]
    public function __invoke(
        ChatInput $input,
        PairChats $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->attached($input->inboxId);
        $commands->run(new LeaveInboxCommand($input->inboxId, [$actors->actor()]));

        return $redirect->back(303);
    }
}
