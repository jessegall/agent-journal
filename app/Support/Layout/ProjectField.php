<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Contracts\Projects\CurrentProject;
use App\Contracts\Projects\ProjectDestination;
use App\Contracts\Projects\ProjectDirectory;
use App\Data\Projects\ProjectData;
use App\Enums\Projects\ProjectSelectionType;

/**
 * The Project field of a create dialog: under All projects a choice of every project, by label with the key beside a
 * label two projects share; within one project no field, since the record goes to that project.
 */
final readonly class ProjectField
{
    /**
     * The name the chosen project is sent under.
     */
    public const string NAME = 'project';

    private const string LABEL = 'Project';

    private const string GLOBAL_LABEL = 'Global';

    public function __construct(
        private CurrentProject $projects,
        private ProjectDirectory $directory,
    ) {}

    /**
     * The field of a dialog whose record belongs to one project; none within a selection of one.
     *
     * @return list<LayoutPartData>
     */
    public function forProject(): array
    {
        return $this->fieldsWith([], []);
    }

    /**
     * The field of a dialog whose record may also be Global, which is offered after the projects.
     *
     * @return list<LayoutPartData>
     */
    public function forProjectOrGlobal(): array
    {
        return $this->fieldsWith([ProjectDestination::GLOBAL], [self::GLOBAL_LABEL]);
    }

    /**
     * The field offering every project and then the extra options, under All projects only.
     *
     * @param  list<string>  $extraOptions
     * @param  list<string>  $extraLabels
     * @return list<LayoutPartData>
     */
    private function fieldsWith(array $extraOptions, array $extraLabels): array
    {
        if ($this->projects->selection()->type !== ProjectSelectionType::All) {
            return [];
        }

        $listed = $this->directory->listed();
        $options = [...array_map(fn (ProjectData $project): string => $project->id, $listed), ...$extraOptions];

        return [LayoutPartData::field(
            self::NAME,
            self::LABEL,
            new LayoutFieldData(self::NAME, '', [], $options, [...$this->labelsOf($listed), ...$extraLabels]),
            'choice',
        )];
    }

    /**
     * Each project's label, with its key beside a label another project shares.
     *
     * @param  list<ProjectData>  $listed
     * @return list<string>
     */
    private function labelsOf(array $listed): array
    {
        $counts = array_count_values(array_map(fn (ProjectData $project): string => $project->label, $listed));

        return array_map(
            fn (ProjectData $project): string => $counts[$project->label] > 1
                ? "{$project->label} ({$project->key})"
                : $project->label,
            $listed,
        );
    }
}
