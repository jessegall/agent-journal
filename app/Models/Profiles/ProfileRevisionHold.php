<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\RevisionFenceReconciled;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $profile_key
 * @property int $profile_revision
 * @property ?CarbonImmutable $reconciled_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Table('profile_revision_holds')]
final class ProfileRevisionHold extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'profile_revision' => 'integer',
            'reconciled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    public function markReconciledAt(CarbonImmutable $time): void
    {
        $this->reconciled_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new RevisionFenceReconciled($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * Keeps the fence of the revision once; fencing the same revision again changes nothing.
     */
    public static function retain(string $key, int $revision): self
    {
        $fence = new self();
        $fence->profile_key = $key;
        $fence->profile_revision = $revision;
        $fence->setAttribute($fence->getKeyName(), $fence->newUniqueId());
        $fence->insertIfAbsent();

        return self::query()->ofRevision($key, $revision)->sole();
    }

    /**
     * The fences whose sessions may still run, oldest first.
     *
     * @return list<self>
     */
    public static function pending(int $limit): array
    {
        $pending = self::query()->unreconciled()->oldestFirst()->readExactly($limit)->get();

        return array_values($pending->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The fence of the profile's revision.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRevision(Builder $query, string $key, int $revision): void
    {
        $query->where('profile_key', $key)->where('profile_revision', $revision);
    }

    /**
     * The fences not reconciled yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unreconciled(Builder $query): void
    {
        $query->whereNull('reconciled_at');
    }

    /**
     * The fences oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function oldestFirst(Builder $query): void
    {
        $query->orderBy('created_at');
    }
}
