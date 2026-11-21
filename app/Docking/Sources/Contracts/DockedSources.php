<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Cards\DockIdentity;

/**
 * Whether any conversation docks a source now.
 */
interface DockedSources
{
    public function isDocked(DockIdentity $source): bool;
}
