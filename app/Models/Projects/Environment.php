<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\EnvironmentOpened;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Projects\Exceptions\InvitationUnusable;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $project_id
 * @property string $label
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
final class Environment extends JournalModel implements EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProject;
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * The label of the environment a new project starts with.
     */
    public const string DEFAULT_LABEL = 'Main';

    /**
     * The most environments one project lists.
     */
    public const int LISTED_LIMIT = 100;

    public const ?string UPDATED_AT = null;

    protected $table = 'project_environments';

    // ----------[ Constructors ]----------

    /**
     * The environment a new project starts with.
     */
    public static function createForDefault(Project $project): self
    {
        return self::create($project, self::DEFAULT_LABEL);
    }

    /**
     * A new environment of the project under a label no other environment of it has.
     */
    public static function create(Project $project, string $label): self
    {
        $environment = new self();
        $environment->project_id = $project->id;
        $environment->label = $label;
        $environment->saveAndAssert();
        $environment->raise(new EnvironmentOpened($environment->id, $project->id, CarbonImmutable::now()));

        return $environment;
    }

    // ----------[ Queries ]----------

    /**
     * The environment of this id in this project, locked until the transaction ends; one that is gone, or of another
     * project, makes the line unusable.
     *
     * @throws InvitationUnusable
     */
    public static function findLockedOfProjectForLine(string $id, string $projectId): self
    {
        return self::query()
            ->whereKey($id)
            ->ofProject($projectId)
            ->lockForUpdate()
            ->firstOr(InvitationUnusable::throwing()->forTicket());
    }

    /**
     * The environment of this id in this project.
     */
    public static function findForProjectById(string $projectId, string $id): self
    {
        return self::query()->whereKey($id)->ofProject($projectId)->firstOrFail();
    }

    /**
     * The environments of these projects, by label, in one read.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function findListedOfProjects(array $ids): array
    {
        return array_values(self::query()->ofProjects($ids)->inLabelOrder()
            ->readUpTo(self::LISTED_LIMIT * max(count($ids), 1))->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectId): void
    {
        $query->where('project_id', $projectId);
    }

    /**
     * The environments of the projects.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofProjects(Builder $query, array $ids): void
    {
        $query->whereIn('project_id', $ids);
    }

    /**
     * The environments in the order of their label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inLabelOrder(Builder $query): void
    {
        $query->orderBy('label');
    }
}
