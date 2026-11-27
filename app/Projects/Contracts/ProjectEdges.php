<?php

declare(strict_types=1);

namespace App\Projects\Contracts;

use App\Exceptions\CrossProjectEdge;

/**
 * The check before two records are joined: both of one project, or one of them Global or owned by no project.
 */
interface ProjectEdges
{
    /**
     * Refuses joining two records of different projects.
     *
     * @throws CrossProjectEdge
     */
    public function assertJoinable(object $joined, object $other): void;
}
