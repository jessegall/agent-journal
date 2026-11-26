<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Projects\Contracts\CurrentProject;
use App\Projects\Contracts\ProjectDestination;
use App\Projects\Contracts\ProjectDirectory;
use App\Projects\Data\ProjectData;
use App\Projects\Enums\ProjectSelectionType;

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
     * @param  list<string>  $labels
     * @return list<LayoutPartData>
     */
    private function fieldsWith(array $extraOptions, array $labels): array
    {
        if ($this->projects->selection()->type !== ProjectSelectionType::All) {
            return [];
        }

        $listed = $this->directory->listed();
        $options = [...array_map(fn (ProjectData $project): string => $project->id, $listed), ...$extraOptions];

        return [LayoutPartData::field(
            self::NAME,
            self::LABEL,
            new LayoutFieldData(self::NAME, '', [], $options, [...$this->labelsOf($listed), ...$labels]),
            'choice',
        )];
    }

    /**
     * The project's label as a choice and a row show it, with its key beside a label another listed project shares.
     *
     * @param  list<ProjectData>  $listed
     */
    public static function labelOf(ProjectData $project, array $listed): string
    {
        foreach ($listed as $other) {
            if ($other->id !== $project->id && $other->label === $project->label) {
                return "{$project->label} · {$project->key}";
            }
        }

        return $project->label;
    }

    /**
     * Each project's label as labelOf writes it.
     *
     * @param  list<ProjectData>  $listed
     * @return list<string>
     */
    private function labelsOf(array $listed): array
    {
        return array_map(fn (ProjectData $project): string => self::labelOf($project, $listed), $listed);
    }
}
