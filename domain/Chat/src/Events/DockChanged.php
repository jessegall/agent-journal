<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A source was docked in a chat or undocked from it. Raised after the commit; both sides' pages read their
 * dock again, and nothing about the source travels with it.
 */
final readonly class DockChanged extends ChatEvent implements UserInterfaceUpdater
{
    public function __construct(public string $inboxId) {}
}
