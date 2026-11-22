<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\ClearDeletedSource;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Cards\DockIdentity;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Removes every placement of a source its owner deleted for good, from every conversation.
 *
 * @extends Command<null>
 */
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class ClearDeletedSourceCommand extends Command
{
    public function __construct(public string $type, public string $id) {}

    public function source(): DockIdentity
    {
        return new DockIdentity($this->type, $this->id);
    }
}
