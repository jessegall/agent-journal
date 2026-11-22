<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\Sources\Contracts\DockSourceChanged;

/**
 * A document or report was settled as needing no more attention. It carries ids only.
 */
final readonly class RecordSettled implements DockSourceChanged, Event, UserInterfaceUpdater
{
    public function __construct(public string $recordType, public string $recordId) {}

    public function dockType(): string
    {
        return $this->recordType;
    }

    public function dockId(): string
    {
        return $this->recordId;
    }
}
