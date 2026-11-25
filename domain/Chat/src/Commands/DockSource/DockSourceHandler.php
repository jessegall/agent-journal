<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\DockSource;

use App\Support\Cards\DockIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Values\DockResult;

final readonly class DockSourceHandler extends ChatCommandHandler
{
    public function __construct(private DockRequests $requests) {}

    /**
     * Docks the source, or answers the placement it has there already; the locked chat keeps two docks of
     * one source to one row.
     */
    public function handle(DockSourceCommand $command): DockResult
    {
        $inbox = $this->requests->lockedInbox($command->chat);
        $source = new DockIdentity($command->type, $command->id);
        $this->requests->assertReadable($source, $command->presentation);
        $existing = DockPlacement::findDocked($inbox, $source);

        if ($existing !== null) {
            return DockResult::of(DockOutcome::Present, $existing->id);
        }

        $placement = DockPlacement::create(
            $inbox,
            $source,
            $command->presentation,
            $command->dispatchedBy(),
        );

        return DockResult::of(DockOutcome::Added, $placement->id);
    }
}
