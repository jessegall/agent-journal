<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Data\CreateGroupInput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

final readonly class CreateGroupChatController
{
    /**
     * Opens a group chat with the users named and shows it. The command rechecks every rule on submission.
     */
    public function __invoke(
        CreateGroupInput $input,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $inboxId = $commands->run(new CreateGroupChatCommand($input->title, $input->userIds));

        return $request->expectsJson()
            ? new JsonResponse(['inboxId' => $inboxId])
            : $redirect->back(303);
    }
}
