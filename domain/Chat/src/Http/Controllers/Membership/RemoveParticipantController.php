<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\LeaveInbox\LeaveInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\Data\ParticipantInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Removes a member from a group chat; the viewer must manage its members.
 */
final readonly class RemoveParticipantController
{
    #[Dispatches(LeaveInboxCommand::class)]
    public function __invoke(
        ParticipantInput $input,
        PairChats $chats,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->assertManages($input->inboxId);
        $commands->run(new LeaveInboxCommand($input->inboxId, [ActorReference::fromText($input->participant)]));

        return $redirect->back(303);
    }
}
