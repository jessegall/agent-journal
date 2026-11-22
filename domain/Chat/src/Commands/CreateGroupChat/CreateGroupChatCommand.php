<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateGroupChat;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Opens a group chat of users with a title, owned by the asker, and adds each user named; the answer is the chat's
 * inbox id.
 *
 * @extends Command<string>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class CreateGroupChatCommand extends Command
{
    /**
     * @param  list<string>  $userIds
     */
    public function __construct(
        #[Required]
        public string $title,
        public array $userIds,
    ) {}

    /**
     * @return list<ActorIdentity>
     */
    public function members(): array
    {
        return array_map(fn (string $userId) => new ActorIdentity(ActorType::User, $userId), $this->userIds);
    }
}
