<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * The retained intent to fence every session started from one revoked configuration revision, named by an opaque
 * reference. Host reconciliation stops those sessions and marks the fence reconciled; until then it stays pending.
 *
 * @property string $id
 * @property string $revision_reference
 * @property CarbonImmutable|null $reconciled_at
 */
#[Table('revision_fences')]
#[Fillable(['revision_reference', 'reconciled_at'])]
final class RevisionFence extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['reconciled_at' => 'immutable_datetime'];
    }

    /**
     * Keeps the fence of the revision once; fencing the same revision again changes nothing.
     */
    public static function retain(string $revisionReference): self
    {
        return self::query()->where('revision_reference', $revisionReference)->first()
            ?? self::query()->create(['revision_reference' => $revisionReference]);
    }

    public static function isPending(string $revisionReference): bool
    {
        return self::query()->where('revision_reference', $revisionReference)->whereNull('reconciled_at')->exists();
    }
}
