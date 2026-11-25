<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Connections\ProjectCreated;
use App\Exceptions\ModelMissing;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $key
 * @property string $label
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class Project extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    public static function create(string $key, string $label): self
    {
        $project = new self();
        $project->key = $key;
        $project->label = $label;
        $project->assertSaved($project->save());
        $project->raise(new ProjectCreated($project->id, CarbonImmutable::now()));

        return $project;
    }

    // ----------[ Queries ]----------

    /**
     * @throws ModelMissing when there is no project of this id
     */
    public static function findForId(string $id): self
    {
        return self::query()->whereKey($id)->firstOr(static fn () => throw ModelMissing::for(self::class, $id));
    }

    public static function findForKey(string $key): self
    {
        return self::query()->withKey($key)->firstOrFail();
    }

    /**
     * The journal's own project, the one its configured key names.
     */
    public static function findLocal(): self
    {
        return self::findForKey(self::localKey());
    }

    /**
     * Every connected project, by label; an installation connects a handful.
     *
     * @return list<self>
     */
    public static function findListed(): array
    {
        return array_values(
            self::query()->inLabelOrder()->readAll('an installation connects a handful of projects')->get()->all(),
        );
    }

    // ----------[ Answers ]----------

    /**
     * Whether this is the journal's own project rather than a connected one.
     */
    public function isLocal(): bool
    {
        return $this->key === self::localKey();
    }

    // ----------[ Internals ]----------

    private static function localKey(): string
    {
        return Container::getInstance()->make('config')->string('processes.project_key');
    }

    // ----------[ Scopes ]----------

    /**
     * The projects in the order of their label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inLabelOrder(Builder $query): void
    {
        $query->orderBy('label');
    }

    /**
     * The project of the key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withKey(Builder $query, string $key): void
    {
        $query->where('key', $key);
    }
}
