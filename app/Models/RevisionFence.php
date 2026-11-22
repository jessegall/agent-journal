<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * The retained intent to fence every session started from one revoked profile revision. Launch reconciliation stops
 * those sessions and marks the fence reconciled once none of them runs; until then it stays pending.
 *
 * @property string $id
 * @property string $profile_key
 * @property int $profile_revision
 * @property CarbonImmutable|null $reconciled_at
 */
#[Table('revision_fences')]
#[Fillable(['profile_key', 'profile_revision', 'reconciled_at'])]
final class RevisionFence extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['profile_revision' => 'integer', 'reconciled_at' => 'immutable_datetime'];
    }

    // ----------[ Queries ]----------

    /**
     * Keeps the fence of the revision once; fencing the same revision again changes nothing.
     */
    public static function retain(string $key, int $revision): self
    {
        $fence = new self(['profile_key' => $key, 'profile_revision' => $revision]);
        $fence->setAttribute($fence->getKeyName(), $fence->newUniqueId());
        $fence->insertIfAbsent();

        return self::query()->where('profile_key', $key)->where('profile_revision', $revision)->sole();
    }

    public static function isPending(string $key, int $revision): bool
    {
        return self::query()
            ->where('profile_key', $key)
            ->where('profile_revision', $revision)
            ->whereNull('reconciled_at')
            ->exists();
    }

    /**
     * The fences whose sessions may still run, oldest first.
     *
     * @return list<self>
     */
    public static function pending(int $limit): array
    {
        $pending = self::query()->whereNull('reconciled_at')->orderBy('created_at')->readExactly($limit)->get();

        return array_values($pending->all());
    }

    // ----------[ Mutations ]----------

    public function markReconciledAt(CarbonImmutable $time): void
    {
        $this->reconciled_at = $time;
        $this->save();
    }
}
