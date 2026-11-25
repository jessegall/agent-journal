<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Connections\EnvironmentOpened;
use App\Exceptions\InvitationUnusable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One environment of a connected project, such as Main or Research: a binding works in one, and its commands and the
 * device overview are scoped to it. A label is unique within its project.
 *
 * @property string $id
 * @property string $project_id
 * @property string $label
 * @property CarbonImmutable|null $created_at
 */
#[Fillable([
    'project_id',
    'label',
])]
final class Environment extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        return self::createForLabel($project, self::DEFAULT_LABEL);
    }

    /**
     * A new environment of the project under a label no other environment of it has.
     */
    public static function createForLabel(Project $project, string $label): self
    {
        $environment = new self();
        $environment->project_id = $project->id;
        $environment->label = $label;
        $environment->assertSaved($environment->save());
        $environment->raise(new EnvironmentOpened($environment->id, $project->id, CarbonImmutable::now()));

        return $environment;
    }

    // ----------[ Asserts ]----------

    // ----------[ Queries ]----------

    /**
     * The environment of this id in this project, locked until the transaction ends; one that is gone, or of another
     * project, makes the line unusable.
     *
     * @throws InvitationUnusable
     */
    public static function lockOfProjectForLine(string $id, string $projectId): self
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
    public static function ofProjectById(string $projectId, string $id): self
    {
        return self::query()->whereKey($id)->ofProject($projectId)->firstOrFail();
    }

    /**
     * The environments of the project, by label.
     *
     * @return list<self>
     */
    public static function listedOf(string $projectId): array
    {
        return array_values(self::query()->ofProject($projectId)->inLabelOrder()->limit(self::LISTED_LIMIT)
            ->get()->all());
    }

    /**
     * The environments of these projects, by label, in one read.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function listedOfProjects(array $ids): array
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
