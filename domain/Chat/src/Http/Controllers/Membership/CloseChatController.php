<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\CloseChat;
use Domain\Chat\Data\ChatInput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

final readonly class CloseChatController
{
    /**
     * Closes a chat the asker owns. The command rechecks every rule on submission.
     */
    public function __invoke(
        ChatInput $input,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $commands->run(new CloseChat($input->inboxId));

        return $request->expectsJson()
            ? new JsonResponse(['inboxId' => $input->inboxId])
            : $redirect->back(303);
    }
}
