<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Projects\ProjectDirectory;
use App\Data\Projects\ProjectData;
use App\Models\Projects\Project;

/**
 * The journal's projects as a browser may choose them, read from the project rows.
 */
final readonly class ListedProjects implements ProjectDirectory
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
