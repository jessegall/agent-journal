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
use App\Models\Support\JournalModel;
use App\Support\Storage\SettingsDocument;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $owner
 * @property int $revision
 * @property SettingsDocument $document
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('settings_records')]
final class SettingsRecord extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
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
    public static function create(string $owner): void
    {
        $record = new self();
        $record->setAttribute($record->getKeyName(), $record->newUniqueId());
        $record->owner = $owner;
        $record->revision = 0;
        $record->document = SettingsDocument::empty();
        $record->insertIfAbsent();
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

    // ----------[ Queries ]----------

    /**
     * The owner's record, read for the runtime of the whole installation and not for any one actor; none while the
     * owner has never stored an override.
     *
     * @return Option<self>
     */
    public static function findSharedRuntimeForOwner(string $owner): Option
    {
        $settingsRecord = self::query()->ownedBy($owner)->first();

        return Option::fromValue($settingsRecord);
    }

    /**
     * The records of the owners that stored an override, by owner, read at once for the whole installation.
     *
     * @param  list<string>  $owners
     * @return array<string, self>
     */
    public static function findSharedRuntimeForOwners(array $owners): array
    {
        return self::query()->ofOwners($owners)->limit(count($owners))->get()->keyBy('owner')->all();
    }

    /**
     * The owner's record, locked until the transaction ends; insertIfAbsent runs first, so the record exists.
     */
    public static function findLockedForOwner(string $owner): self
    {
        return self::query()->ownedBy($owner)->lockForUpdate()->firstOrFail();
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

    /**
     * The records of the owners.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $owners
     */
    #[Scope]
    protected function ofOwners(Builder $query, array $owners): void
    {
        $query->whereIn('owner', $owners);
    }
}
