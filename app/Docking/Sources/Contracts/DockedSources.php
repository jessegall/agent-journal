<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Support\Cards\DockIdentity;

/**
 * Whether any conversation docks a source now.
 */
interface DockedSources
{
    /**
     * Whether the source has a docked card now.
     */
    public function isDocked(DockIdentity $source): bool;

    /**
     * The ids of the inboxes the source is docked in, at most a hundred.
     *
     * @return list<string>
     */
    public function inboxesDocking(DockIdentity $source): array;
}
