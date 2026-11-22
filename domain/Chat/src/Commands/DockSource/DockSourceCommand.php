<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\DockSource;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use App\Support\Sources\DockDefinition;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Values\DockResult;

/**
 * Docks one readable source in a conversation the actor takes part in, for both sides of it: the one named, or the
 * only one it has.
 *
 * @extends Command<DockResult>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class DockSourceCommand extends Command
{
    public function __construct(
        public string|null $chat,
        public string $type,
        public string $id,
        public string $presentation = DockDefinition::DEFAULT_PRESENTATION,
    ) {}

}
