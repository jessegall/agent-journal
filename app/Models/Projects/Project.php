<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Connections\ProjectCreated;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $key
 * @property string $label
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
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

    public static function forId(string $id): self
    {
        return self::query()->whereKey($id)->firstOrFail();
    }

    public static function forKey(string $key): self
    {
        return self::query()->withKey($key)->firstOrFail();
    }

    /**
     * Every connected project, by label; an installation connects a handful.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(
            self::query()->inLabelOrder()->readAll('an installation connects a handful of projects')->get()->all(),
        );
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
