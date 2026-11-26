<?php

declare(strict_types=1);

namespace App\Projects\Contracts;

use App\Projects\Data\ProjectData;

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
