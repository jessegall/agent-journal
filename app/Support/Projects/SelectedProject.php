<?php

declare(strict_types=1);

namespace App\Support\Projects;

use App\Contracts\Projects\CurrentProject;
use App\Enums\Projects\ProjectSelectionType;
use App\Exceptions\ModelMissing;
use App\Exceptions\ProjectNotChosen;
use App\Models\Projects\Project;

/**
 * The project a write of the journal's own records names: the selected one, or the journal's own project while every
 * project is selected.
 */
final readonly class SelectedProject
{
    public function __construct(private CurrentProject $projects) {}

    /**
     * @throws ProjectNotChosen when the selection is none
     * @throws ModelMissing when the selected project is gone
     */
    public function find(): Project
    {
        $selection = $this->projects->selection();

        if ($selection->type === ProjectSelectionType::All) {
            return Project::findLocal();
        }

        return Project::findForId($selection->projectId());
    }
}
