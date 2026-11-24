<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Casts\SettingsDocumentCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Settings\SettingsRevised;
use App\Support\Storage\SettingsDocument;
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
final class SettingsRecord extends Model implements EventSource, ReadableModel
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
            'revision' => 'integer',
            'document' => SettingsDocumentCast::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Makes the owner's empty record at revision 0 in one insert that does nothing when it exists, so the unique owner
     * key decides between two writers without aborting the transaction.
     */
    public static function makeEmptyFor(string $owner): void
    {
        $record = new self();
        $record->setAttribute($record->getKeyName(), $record->newUniqueId());
        $record->owner = $owner;
        $record->revision = 0;
        $record->document = SettingsDocument::empty();
        $record->insertIfAbsent();
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
     * The records of the owners that stored an override, by owner, read at once for the whole installation.
     *
     * @param  list<string>  $owners
     * @return array<string, self>
     */
    public static function sharedRuntimeForOwners(array $owners): array
    {
        return self::query()->whereIn('owner', $owners)->limit(count($owners))->get()->keyBy('owner')->all();
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
        $this->assertSaved($this->save());
        $this->raise(new SettingsRevised($this->id));
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
