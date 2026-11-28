<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\JoinInbox\JoinInboxCommand;
use App\Support\ActorReference;
use Domain\Chat\Data\ParticipantInput;
use Domain\Chat\Support\ChatDirectory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Adds a member to a group chat; the viewer must manage its members.
 */
final readonly class AddParticipantController
{
    #[Dispatches(JoinInboxCommand::class)]
    public function __invoke(
        ParticipantInput $input,
        ChatDirectory $chats,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $chats->assertManages($input->inboxId);
        $commands->run(new JoinInboxCommand($input->inboxId, ActorReference::fromText($input->participant)));

        return $redirect->back(303);
    }
}
