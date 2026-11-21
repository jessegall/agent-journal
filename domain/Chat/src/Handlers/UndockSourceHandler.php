<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Docking\Cards\DockIdentity;
use Domain\Chat\Commands\UndockSource;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Values\DockResult;

final readonly class UndockSourceHandler extends ChatCommandHandler
{
    public function __construct(private DockRequests $requests) {}

    /**
     * Removes the placement when it docks that source in this conversation; any other id is answered as nothing to
     * act on, without saying why.
     */
    public function handle(UndockSource $command, Conversation $conversation): DockResult
    {
        $this->requests->assertJoined($conversation);
        $source = new DockIdentity($command->type, $command->id);
        $this->requests->assertReadable($source);
        $placement = DockPlacement::matching($conversation, $command->placementId, $source);

        if ($placement === null) {
            return DockResult::unavailable();
        }

        $placement->remove();

        return DockResult::of(DockOutcome::Removed, $command->placementId);
    }
}
