<?php

declare(strict_types=1);

namespace App\Projects;

use App\Exceptions\CrossProjectEdge;
use App\Projects\Contracts\ProjectOwned;

/**
 * The check before two records are joined, such as an agent and the record it is given: when both belong to a project
 * or to Global, they must be of one project or the other Global; a record no project owns joins any.
 */
final readonly class ProjectEdges
{
    /**
     * @throws CrossProjectEdge
     */
    public function assertJoinable(object $joined, object $other): void
    {
        if ($joined instanceof ProjectOwned && $other instanceof ProjectOwned) {
            $joined->assertSameProjectAs($other);
        }
    }
}
