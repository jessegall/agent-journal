<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Commands\Inboxes\HandOverInbox\HandOverInboxCommand;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorIdentity;
use Domain\Chat\Data\ParticipantInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Hands the viewer's place in a group chat to another actor.
 */
final readonly class TransferChatController
{
    public function __invoke(
        ParticipantInput $input,
        PairChats $chats,
        CurrentActor $actors,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->attached($input->inboxId);

        $commands->run(new HandOverInboxCommand(
            $input->inboxId,
            ActorIdentity::of($actors->actor()),
            ActorIdentity::fromText($input->participant),
        ));

        return $redirect->back(303);
    }
}
