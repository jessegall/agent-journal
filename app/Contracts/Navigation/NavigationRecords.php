<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Data\Navigation\NavigationCountsData;
use App\Data\Navigation\NavigationData;
use Illuminate\Http\Request;

/**
 * What other Core areas use of the Web area's NavigationRecords.
 */
interface NavigationRecords
{
    /**
     * Every visible counted item's count, by key; a count that fails is logged and left out.
     */
    public function counts(): NavigationCountsData;

    /**
     * The navigation the request's reader sees: its groups and pages.
     */
    public function tree(Request $request): NavigationData;
}
