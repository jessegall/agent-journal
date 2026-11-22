<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\Bus\CommandBus;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
use Domain\Chat\Data\ParticipantInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RemoveParticipantController
{
    /**
     * Removes a member from a chat the asker owns. The command rechecks every rule on submission.
     */
    public function __invoke(
        ParticipantInput $input,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RemoveChatParticipantCommand($input->inboxId, $input->participant));

        return $redirect->back(303);
    }
}
