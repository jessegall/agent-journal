<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDestination;
use App\Values\ProjectOwner;
use PhpOption\Option;

/**
 * The destination of a create from the sender's choice, else from the current selection; the bus checks it after.
 */
final readonly class SelectedDestination implements ProjectDestination
{
    public function __construct(private CurrentProject $projects) {}

    public function projectFor(Option $chosen): string
    {
        return $chosen->getOrCall(fn (): string => $this->projects->selection()->projectId());
    }

    public function ownerFor(Option $chosen): ProjectOwner
    {
        if ($chosen->filter(fn (string $choice): bool => $choice === self::GLOBAL)->isDefined()) {
            return ProjectOwner::global();
        }

        return ProjectOwner::ofProject($this->projectFor($chosen));
    }
}
