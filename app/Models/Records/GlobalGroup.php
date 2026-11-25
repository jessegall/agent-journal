<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\GlobalGroupMissing;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $name
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class GlobalGroup extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string JOURNAL = 'journal';

    // ----------[ Constructors ]----------

    /**
     * Creates the journal's group unless it is there already.
     */
    public static function create(): self
    {
        $group = new self();
        $group->name = self::JOURNAL;
        $group->setAttribute($group->getKeyName(), $group->newUniqueId());
        $group->insertIfAbsent();

        return self::findJournal();
    }

    // ----------[ Queries ]----------

    /**
     * The journal's own group, which numbers:install creates before any numbered record is written.
     */
    public static function findJournal(): self
    {
        return self::query()->named(self::JOURNAL)->firstOr(GlobalGroupMissing::throwing()->named(self::JOURNAL));
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
