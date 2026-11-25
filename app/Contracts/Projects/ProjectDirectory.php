<?php

declare(strict_types=1);

namespace App\Contracts\Projects;

use App\Data\Projects\ProjectData;

/**
 * The projects of this journal that a browser may choose.
 */
interface ProjectDirectory
{
    /**
     * Whether a project of this id exists to be chosen.
     */
    public function isListed(string $id): bool;

    /**
     * Every project, by label.
     *
     * @return list<ProjectData>
     */
    public function listed(): array;
}
