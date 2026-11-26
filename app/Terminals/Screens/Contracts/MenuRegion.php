<?php

declare(strict_types=1);

namespace App\Terminals\Screens\Contracts;

use App\Hosts\Data\HostFrameData;
use App\Terminals\Screens\MenuEntries;

/**
 * A region whose entries can be read, such as an option list or a slider, so a key script can move onto one.
 */
interface MenuRegion extends ScreenRegion
{
    /**
     * The entries the region shows and which one is highlighted; none while it is not drawn.
     */
    public function entriesOf(HostFrameData $frame): MenuEntries|null;
}
