<?php

declare(strict_types=1);

namespace App\Contracts\Projects;

use App\Exceptions\CrossProjectEdge;
use App\Values\ProjectOwner;

/**
 * A record that belongs to one project or to Global.
 */
interface ProjectOwned
{
    /**
     * The project this record belongs to, or Global.
     */
    public function projectOwner(): ProjectOwner;

    /**
     * Called before this record is joined to the other; passes when both are of one project or the other is Global.
     *
     * @throws CrossProjectEdge
     */
    public function assertSameProjectAs(self $other): void;
}
