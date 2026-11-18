<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one row of the installation's sharing: whose supervisor run holds the gateways and until when. Every admission
 * and state change of a share locks it first, so the share limits are counted one writer at a time.
 *
 * @property string $id
 * @property string $name
 * @property string|null $run_id
 * @property CarbonImmutable|null $run_lease_ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'run_id', 'run_lease_ends_at'])]
final class ShareInstallation extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-installation';

    private const string NAME = 'installation';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_lease_ends_at' => 'immutable_datetime',
        ];
    }

    /**
     * The installation row, locked until the transaction ends. It is made by an insert that does nothing when it
     * exists, so two first writers never abort each other.
     */
    public static function lockForAdmission(): self
    {
        $now = CarbonImmutable::now();

        self::query()->insertOrIgnore([
            'id' => (new self)->newUniqueId(),
            'name' => self::NAME,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::query()->named(self::NAME)->lockForUpdate()->firstOrFail();
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }
}
