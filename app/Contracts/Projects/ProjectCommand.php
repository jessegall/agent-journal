<?php

declare(strict_types=1);

namespace App\Contracts\Projects;

use App\Values\ProjectOwner;

/**
 * A command that writes a record a project owns, so the bus can check the sender may write there.
 */
interface ProjectCommand
{
    /**
     * The project, or Global, the written record will belong to.
     */
    public function owner(): ProjectOwner;
}
