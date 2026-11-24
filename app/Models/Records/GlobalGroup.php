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
        $row = self::query()->where('name', self::JOURNAL)->first();
        self::assertJournalGroup($row);

        return $row;
    }

    /**
     * Creates the journal's group unless it is there already.
     */
    public static function installJournal(): self
    {
        $group = new self(['name' => self::JOURNAL]);
        $group->setAttribute($group->getKeyName(), $group->newUniqueId());
        $group->insertIfAbsent();

        return self::query()->where('name', self::JOURNAL)->sole();
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an installation whose journal group was never made.
     *
     * @phpstan-assert self $row
     *
     * @throws GlobalGroupMissing
     */
    private static function assertJournalGroup(self|null $row): void
    {
        if ($row === null) {
            throw GlobalGroupMissing::named(self::JOURNAL);
        }
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
