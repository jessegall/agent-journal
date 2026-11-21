<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Listener;
use App\Docking\Sources\Contracts\DockSourceDeleted;
use Domain\Chat\Commands\ClearDeletedSource;

/**
 * Heard after an owner's deletion commits, so a rolled-back deletion removes nothing; the command removes the
 * deleted source from every conversation.
 */
final readonly class RemoveDeletedSource implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(DockSourceDeleted $fact): void
    {
        $this->commands->run(new ClearDeletedSource($fact->dockType(), $fact->dockId()));
    }
}
