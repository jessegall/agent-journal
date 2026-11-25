<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Attributes\Bus\Dispatches;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Models\Access\User;
use App\Support\ActorReference;
use Domain\Chat\Data\CreateGroupInput;
use Domain\Chat\Support\PairChats;
use Illuminate\Http\RedirectResponse;
use Inertia\ResponseFactory;

/**
 * Opens a group chat with the users named and shows it; the viewer must be allowed to open chats.
 */
final readonly class CreateGroupChatController
{
    /**
     * The flash key of the new chat's inbox id.
     */
    public const string CREATED_CHAT = 'createdInboxId';

    #[Dispatches(OpenInboxCommand::class)]
    public function __invoke(CreateGroupInput $input, PairChats $chats, ResponseFactory $inertia): RedirectResponse
    {
        $chats->assertMayCreate();

        $inboxId = $chats->openGroup(
            $input->title,
            array_map(fn (string $userId) => ActorReference::ofClass(User::class, $userId), $input->userIds),
        );

        return $inertia->flash(self::CREATED_CHAT, $inboxId)->back(303);
    }
}
