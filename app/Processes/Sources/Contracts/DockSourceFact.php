<?php

declare(strict_types=1);

namespace App\Processes\Sources\Contracts;

/**
 * A fact about one dockable source, named by its dock type and id.
 */
interface DockSourceFact
{
    /**
     * The type of the record whose docked card the fact touches.
     */
    public function dockType(): string;

    /**
     * The id of the record whose docked card the fact touches.
     */
    public function dockId(): string;
}
