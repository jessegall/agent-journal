<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Cards\DockIdentity;
use App\Docking\Data\DockOfferData;
use PhpOption\Option;

/**
 * Whether the viewer may dock a source, and where to: none when nothing offers a dock, the source is not dockable or
 * the viewer may not read it.
 */
interface DockOffers
{
    /**
     * @return Option<DockOfferData>
     */
    public function offerFor(DockIdentity $source): Option;
}
