<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\NavigationCountsData;
use App\Data\NavigationData;
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

    public function tree(Request $request): NavigationData;
}
