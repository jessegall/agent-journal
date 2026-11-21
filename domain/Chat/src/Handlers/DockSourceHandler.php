<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Docking\Cards\DockIdentity;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Values\DockResult;

final readonly class DockSourceHandler extends ChatCommandHandler
{
    public function __construct(private DockRequests $requests) {}

    /**
     * Docks the source, or answers the placement it has there already; the locked conversation keeps two docks of
     * one source to one row.
     */
    public function handle(DockSource $command): DockResult
    {
        $conversation = $this->requests->lockedConversation($command->chat);
        $source = new DockIdentity($command->type, $command->id);
        $this->requests->assertReadable($source, $command->presentation);
        $existing = DockPlacement::docked($conversation, $source);

        if ($existing !== null) {
            return DockResult::of(DockOutcome::Present, $existing->id);
        }

        $placement = DockPlacement::create(
            $conversation,
            $source,
            $command->presentation,
            ActorIdentity::of($command->dispatchedBy()),
        );

        return DockResult::of(DockOutcome::Added, $placement->id);
    }
}
