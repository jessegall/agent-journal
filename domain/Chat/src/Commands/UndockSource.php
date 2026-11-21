<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\UndockSourceHandler;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Values\DockResult;

/**
 * Undocks one placement from a conversation the actor takes part in, the one named or the only one it has, when the
 * placement still docks the source named.
 *
 * @extends Command<DockResult>
 */
#[RetainedActorRequestKey]
#[HandledBy(UndockSourceHandler::class)]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class UndockSource extends Command
{
    public function __construct(
        public string|null $chat,
        public string $placementId,
        public string $type,
        public string $id,
    ) {}

}
