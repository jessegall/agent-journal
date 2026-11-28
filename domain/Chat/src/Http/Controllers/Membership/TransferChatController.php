<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\HandOverInbox\HandOverInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\Data\ParticipantInput;
use Domain\Chat\Support\ChatDirectory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Hands the viewer's place in a group chat to another actor.
 */
final readonly class TransferChatController
{
    #[Dispatches(HandOverInboxCommand::class)]
    public function __invoke(
        ParticipantInput $input,
        ChatDirectory $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->attached($input->inboxId);

        $commands->run(new HandOverInboxCommand(
            $input->inboxId,
            $actors->actor(),
            ActorReference::fromText($input->participant),
        ));

        return $redirect->back(303);
    }
}
