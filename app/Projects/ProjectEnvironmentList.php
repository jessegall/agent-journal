<?php

declare(strict_types=1);

namespace App\Projects;

use App\Actors\Contracts\CurrentActor;
use App\Connections\ConnectionsOwnerCheck;
use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use App\Projects\Exceptions\InstallAttemptRefused;

/**
 * The environments of a connected project, for an owner who may connect projects; checked again on every read.
 */
final readonly class ProjectEnvironmentList
{
    public function __construct(private CurrentActor $current, private ConnectionsOwnerCheck $owners) {}

    /**
     * @return list<Environment>
     *
     * @throws InstallAttemptRefused
     */
    public function of(Project $project): array
    {
        if (! $this->owners->allows($this->current->actor())) {
            throw InstallAttemptRefused::notAllowed();
        }

        return Environment::findListedOf($project->id);
    }
}
