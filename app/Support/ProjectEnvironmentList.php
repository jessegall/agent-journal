<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CurrentActor;
use App\Exceptions\InstallAttemptRefused;
use App\Models\Environment;
use App\Models\Project;

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

        return Environment::listedOf($project->id);
    }
}
