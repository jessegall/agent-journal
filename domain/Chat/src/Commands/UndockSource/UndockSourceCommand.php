<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\UndockSource;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Values\DockResult;

/**
 * Undocks one placement from a conversation the actor takes part in, the one named or the only one it has, when the
 * placement still docks the source named.
 *
 * @extends Command<DockResult>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class UndockSourceCommand extends Command
{
    public function __construct(
        public string|null $chat,
        public string $placementId,
        public string $type,
        public string $id,
    ) {}

}
