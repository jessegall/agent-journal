<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\RemoveChatParticipant\RemoveChatParticipantCommand;
use Domain\Chat\Data\ParticipantInput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

final readonly class RemoveParticipantController
{
    /**
     * Removes a member from a chat the asker owns. The command rechecks every rule on submission.
     */
    public function __invoke(
        ParticipantInput $input,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $commands->run(new RemoveChatParticipantCommand($input->inboxId, $input->participant));

        return $request->expectsJson()
            ? new JsonResponse(['inboxId' => $input->inboxId])
            : $redirect->back(303);
    }
}
