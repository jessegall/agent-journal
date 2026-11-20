<?php

declare(strict_types=1);

namespace App\Settings\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Settings\Casts\SettingsDocumentCast;
use App\Settings\Storage\SettingsDocument;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * The stored overrides of one settings owner, shared by the whole installation: one row per owner, whose revision
 * rises by one with each change. No row means revision 0 and every setting at its default.
 *
 * @property string $id
 * @property string $owner
 * @property int $revision
 * @property SettingsDocument $document
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('settings_records')]
#[Fillable(['owner', 'revision', 'document'])]
final class SettingsRecord extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'document' => SettingsDocumentCast::class,
        ];
    }

    /**
     * Makes the owner's empty record at revision 0 in one insert that does nothing when it exists, so the unique owner
     * key decides between two writers without aborting the transaction.
     */
    public static function insertIfAbsent(string $owner): void
    {
        $now = CarbonImmutable::now();

        self::query()->insertOrIgnore([
            'id' => new self()->newUniqueId(),
            'owner' => $owner,
            'revision' => 0,
            'document' => SettingsDocument::empty()->toJson(),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The owner's record, read for the runtime of the whole installation and not for any one actor; none while the
     * owner has never stored an override.
     *
     * @return Option<self>
     */
    public static function sharedRuntimeForOwner(string $owner): Option
    {
        return Option::fromValue(self::query()->ownedBy($owner)->first());
    }

    /**
     * The owner's record, locked until the transaction ends; insertIfAbsent runs first, so the record exists.
     */
    public static function lockedForOwner(string $owner): self
    {
        return self::query()->ownedBy($owner)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Stores the changed document as the next revision: one revision for however many entries it changed.
     */
    public function revise(SettingsDocument $document): void
    {
        $this->document = $document;
        $this->revision++;
        $this->save();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, string $owner): void
    {
        $query->where('owner', $owner);
    }
}
