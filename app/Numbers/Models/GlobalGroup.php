<?php

declare(strict_types=1);

namespace App\Numbers\Models;

use App\Links\Support\Linkable;
use App\Numbers\Exceptions\GlobalGroupMissing;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The installation-wide holder of the journal's global numbers, such as task 12 or plan 3; one row named journal.
 *
 * @property string $id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name'])]
final class GlobalGroup extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const string JOURNAL = 'journal';

    /**
     * The journal's own group, which numbers:install creates before any numbered record is written.
     */
    public static function journal(): self
    {
        return self::query()->where('name', self::JOURNAL)->firstOr(
            fn () => throw GlobalGroupMissing::named(self::JOURNAL),
        );
    }

    /**
     * Creates the journal's group unless it is there already.
     */
    public static function installJournal(): self
    {
        return self::query()->firstOrCreate(['name' => self::JOURNAL]);
    }
}
