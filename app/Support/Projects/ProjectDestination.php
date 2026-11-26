<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDestination as ProjectDestinationContract;
use App\Values\ProjectOwner;
use PhpOption\Option;

/**
 * The destination of a create from the sender's choice, else from the current selection; the bus checks it after.
 */
final readonly class ProjectDestination implements ProjectDestinationContract
{
    public function __construct(private CurrentProject $projects) {}

    public function projectFor(Option $chosen): string
    {
        return $chosen->getOrCall(fn (): string => $this->projects->selection()->projectId());
    }

    public function ownerFor(Option $chosen): ProjectOwner
    {
        return ProjectOwner::fromKey($this->projectFor($chosen));
    }
}
