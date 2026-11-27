<?php

declare(strict_types=1);

namespace App\Support\Layout\Contracts;

use App\Support\Layout\LayoutPartData;
use App\Values\ProjectOwner;

/**
 * The label of a list row that names the project the row belongs to.
 */
interface ProjectRowLabel
{
    /**
     * The label parts that name the project owning a row.
     *
     * @return list<LayoutPartData>
     */
    public function partsFor(ProjectOwner $owner): array;
}
