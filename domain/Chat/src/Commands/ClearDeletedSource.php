<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Docking\Cards\DockIdentity;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\ClearDeletedSourceHandler;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Removes every placement of a source its owner deleted for good, from every conversation.
 *
 * @extends Command<null>
 */
#[HandledBy(ClearDeletedSourceHandler::class)]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class ClearDeletedSource extends Command
{
    public function __construct(public string $type, public string $id) {}

    public function source(): DockIdentity
    {
        return new DockIdentity($this->type, $this->id);
    }
}
