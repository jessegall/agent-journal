<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDirectory;
use App\Enums\Projects\ProjectSelectionType;
use App\Values\ProjectOwner;

/**
 * The badge a list row names its project by: under All projects the project's label, with its key beside a label
 * two projects share; a Global row says Global under every choice; a row of the one project chosen says nothing.
 */
final class ProjectRowLabel
{
    private const string KEY = 'project';

    private const string GLOBAL_LABEL = 'Global';

    /**
     * Each project's label by id, read once for all the rows of a page.
     *
     * @var array<string, string>|null
     */
    private array|null $labels = null;

    public function __construct(
        private readonly CurrentProject $projects,
        private readonly ProjectDirectory $directory,
    ) {}

    /**
     * @return list<LayoutPartData>
     */
    public function partsFor(ProjectOwner $owner): array
    {
        if ($owner->isGlobal()) {
            return [LayoutPartData::badge(self::KEY, self::GLOBAL_LABEL)];
        }

        if ($this->projects->selection()->type !== ProjectSelectionType::All) {
            return [];
        }

        return [LayoutPartData::badge(self::KEY, $this->labels()[$owner->projectId()])];
    }

    /**
     * @return array<string, string>
     */
    private function labels(): array
    {
        if ($this->labels !== null) {
            return $this->labels;
        }

        $listed = $this->directory->listed();
        $this->labels = [];

        foreach ($listed as $project) {
            $this->labels[$project->id] = ProjectField::labelOf($project, $listed);
        }

        return $this->labels;
    }
}
