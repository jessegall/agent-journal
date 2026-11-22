<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

/**
 * A fact about one dockable source, named by its dock type and id.
 */
interface DockSourceFact
{
    public function dockType(): string;

    public function dockId(): string;
}
