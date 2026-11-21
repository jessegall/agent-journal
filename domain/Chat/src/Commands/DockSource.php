<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Docking\Sources\DockDefinition;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\DockSourceHandler;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Values\DockResult;

/**
 * Docks one readable source in a conversation the actor takes part in, for both sides of it: the one named, or the
 * only one it has.
 *
 * @extends Command<DockResult>
 */
#[RetainedActorRequestKey]
#[HandledBy(DockSourceHandler::class)]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class DockSource extends Command
{
    public function __construct(
        public string|null $chat,
        public string $type,
        public string $id,
        public string $presentation = DockDefinition::DEFAULT_PRESENTATION,
    ) {}

}
