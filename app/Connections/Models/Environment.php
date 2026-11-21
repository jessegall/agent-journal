<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Events\EnvironmentOpened;
use App\Connections\Exceptions\InvitationUnusable;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
#[Fillable(['project_id', 'label'])]
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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['created_at' => 'immutable_datetime'];
    }

    /**
     * The environment a new project starts with.
     */
    public static function openDefaultOf(Project $project): self
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
        $environment->assertSaved($environment->save());
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
    public static function lockOfProjectForLine(string $id, string $projectId): self
    {
        return self::query()->whereKey($id)->ofProject($projectId)->lockForUpdate()
            ->firstOr(fn () => throw InvitationUnusable::forTicket());
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
        return array_values(self::query()->ofProject($projectId)->orderBy('label')->limit(self::LISTED_LIMIT)
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
        return array_values(self::query()->whereIn('project_id', $ids)->orderBy('label')
            ->limit(self::LISTED_LIMIT * max(count($ids), 1))->get()->all());
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
}
