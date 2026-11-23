<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\ProjectCreated;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A project connected to this journal from another machine, under a unique key. The installation's own project is
 * not a row: it stays the configured key.
 *
 * @property string $id
 * @property string $key
 * @property string $label
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key', 'label'])]
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

    /**
     * Every connected project, by label; an installation connects a handful.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(
            self::query()->orderBy('label')->readAll('an installation connects a handful of projects')->get()->all(),
        );
    }
}
