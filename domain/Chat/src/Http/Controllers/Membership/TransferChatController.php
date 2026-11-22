<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\CommandBus;
use Domain\Chat\Commands\TransferChatOwnership\TransferChatOwnershipCommand;
use Domain\Chat\Data\ParticipantInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class TransferChatController
{
    /**
     * Hands a chat the asker owns to another member. The command rechecks every rule on submission.
     */
    public function __invoke(
        ParticipantInput $input,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new TransferChatOwnershipCommand($input->inboxId, $input->participant));

        return $redirect->back(303);
    }
}
