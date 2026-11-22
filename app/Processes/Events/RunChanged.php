<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\PartProjection;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A run changed after its change was stored: its next update number, and the parts that changed with the reading each
 * now shows. A client that sees a gap in the numbers reloads the run's snapshot.
 */
final readonly class RunChanged implements
    DockSourceChanged,
    Event,
    UserInterfaceUpdater
{
    /**
     * @param  list<PartProjection>  $parts
     */
    public function __construct(public string $runId, public int $sequence, public array $parts) {}

    public function dockType(): string
    {
        return ProcessRun::DOCK_TYPE;
    }

    public function dockId(): string
    {
        return $this->runId;
    }
}
