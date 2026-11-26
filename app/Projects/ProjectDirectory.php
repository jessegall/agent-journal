<?php

declare(strict_types=1);

namespace App\Projects;

use App\Models\Projects\Project;
use App\Projects\Contracts\ProjectDirectory as ProjectDirectoryContract;
use App\Projects\Data\ProjectData;

/**
 * The journal's projects as a browser may choose them, read from the project rows.
 */
final readonly class ProjectDirectory implements ProjectDirectoryContract
{
    public function isListed(string $id): bool
    {
        foreach ($this->listed() as $project) {
            if ($project->id === $id) {
                return true;
            }
        }

        return false;
    }

    public function listed(): array
    {
        return array_map(
            fn (Project $project): ProjectData => ProjectData::from([
                'id' => $project->id,
                'key' => $project->key,
                'label' => $project->label,
            ]),
            Project::findListed(),
        );
    }
}
