<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\CommandBus;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use Domain\Chat\Data\CreateGroupInput;
use Illuminate\Http\RedirectResponse;
use Inertia\ResponseFactory;

final readonly class CreateGroupChatController
{
    /**
     * The flash key of the new chat's inbox id.
     */
    public const string CREATED_CHAT = 'createdInboxId';

    /**
     * Opens a group chat with the users named and shows it. The command rechecks every rule on submission.
     */
    public function __invoke(
        CreateGroupInput $input,
        CommandBus $commands,
        ResponseFactory $inertia,
    ): RedirectResponse {
        $inboxId = $commands->run(new CreateGroupChatCommand($input->title, $input->userIds));

        return $inertia->flash(self::CREATED_CHAT, $inboxId)->back(303);
    }
}
