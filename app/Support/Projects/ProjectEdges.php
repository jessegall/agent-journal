<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Projects\ProjectOwned;
use App\Exceptions\CrossProjectEdge;

/**
 * The check before two things are joined, such as an agent and the record it is given: when both belong to a project
 * or to Global, they must be of one project or the other Global; a thing no project owns joins anything.
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
