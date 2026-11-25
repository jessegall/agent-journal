<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorIdentity;
use Domain\Chat\Data\ParticipantInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Removes a member from a group chat; the viewer must manage its members.
 */
final readonly class RemoveParticipantController
{
    public function __invoke(
        ParticipantInput $input,
        PairChats $chats,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->assertManages($input->inboxId);
        $commands->run(new LeaveInboxCommand($input->inboxId, ActorIdentity::fromText($input->participant)));

        return $redirect->back(303);
    }
}
