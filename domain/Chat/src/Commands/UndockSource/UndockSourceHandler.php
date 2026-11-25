<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\UndockSource;

use App\Support\Cards\DockIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Values\DockResult;

final readonly class UndockSourceHandler extends ChatCommandHandler
{
    public function __construct(private DockRequests $requests) {}

    /**
     * Removes the placement when it docks that source in this chat; any other id is answered as nothing to
     * act on, without saying why.
     */
    public function handle(UndockSourceCommand $command): DockResult
    {
        $inbox = $this->requests->lockedInbox($command->chat);
        $source = new DockIdentity($command->type, $command->id);
        $this->requests->assertReadable($source);
        $placement = DockPlacement::matching($inbox, $command->placementId, $source);

        if ($placement === null) {
            return DockResult::unavailable();
        }

        $placement->remove();

        return DockResult::of(DockOutcome::Removed, $command->placementId);
    }
}
