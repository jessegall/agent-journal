<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Enums\ActorType;
use App\Support\ActorIdentity;
use Domain\Chat\Data\CreateGroupInput;
use Domain\Chat\Support\ChatInboxes;
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

    public function __invoke(CreateGroupInput $input, ChatInboxes $chats, ResponseFactory $inertia): RedirectResponse
    {
        $chats->assertMayCreate();
        $inboxId = $chats->openGroup(
            $input->title,
            array_map(fn (string $userId) => new ActorIdentity(ActorType::User, $userId), $input->userIds),
        );

        return $inertia->flash(self::CREATED_CHAT, $inboxId)->back(303);
    }
}
