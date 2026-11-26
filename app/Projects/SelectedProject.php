<?php

declare(strict_types=1);

namespace App\Projects;

use App\Exceptions\ModelMissing;
use App\Models\Projects\Project;
use App\Projects\Contracts\CurrentProject;
use App\Projects\Enums\ProjectSelectionType;
use App\Projects\Exceptions\ProjectNotChosen;

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
