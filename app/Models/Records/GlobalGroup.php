<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\GlobalGroupMissing;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $name
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable(['name'])]
final class GlobalGroup extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string JOURNAL = 'journal';

    // ----------[ Queries ]----------

    /**
     * The journal's own group, which numbers:install creates before any numbered record is written.
     */
    public static function journal(): self
    {
        return self::query()->named(self::JOURNAL)->firstOr(GlobalGroupMissing::throwing()->named(self::JOURNAL));
    }

    /**
     * Creates the journal's group unless it is there already.
     */
    public static function installJournal(): self
    {
        $group = new self(['name' => self::JOURNAL]);
        $group->setAttribute($group->getKeyName(), $group->newUniqueId());
        $group->insertIfAbsent();

        return self::query()->named(self::JOURNAL)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }
}
