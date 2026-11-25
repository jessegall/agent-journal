<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Accounts\ProfileRetired;
use App\Exceptions\ProfileMissing;
use App\Values\ProfileKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A profile's lasting identity: its stable key, its label and which of its revisions is current. A retired profile
 * keeps its key and revisions but is no longer offered to new starts.
 *
 * @property string $id
 * @property string $key
 * @property string $label
 * @property string $description
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'key',
    'label',
    'description',
    'current_revision_id',
    'retired_at',
])]
final class Profile extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.profile';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'retired_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the profile out of new starts; its key and revisions stay.
     */
    public function retire(): void
    {
        $this->retired_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new ProfileRetired($this->id));
    }

    // ----------[ Predicates ]----------

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a profile key no profile holds.
     *
     * @phpstan-assert self $row
     *
     * @throws ProfileMissing
     */
    private static function assertFound(self|null $row, ProfileKey $key): void
    {
        if ($row === null) {
            throw ProfileMissing::for($key);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The profile with this key, retired or not, locked until the transaction ends.
     *
     * @throws ProfileMissing
     */
    public static function lockByKey(ProfileKey $key): self
    {
        $row = self::query()->withKey($key)->lockForUpdate()->first();
        self::assertFound($row, $key);

        return $row;
    }

    /**
     * The profile with this key, retired or not.
     *
     * @throws ProfileMissing
     */
    public static function byKey(ProfileKey $key): self
    {
        $row = self::query()->withKey($key)->first();
        self::assertFound($row, $key);

        return $row;
    }

    public static function hasCurrent(ProfileKey $key): bool
    {
        return self::query()->withKey($key)->unretired()->exists();
    }

    /**
     * Every profile, current ones and retired ones, by key.
     *
     * @return list<self>
     */
    public static function listed(int $limit): array
    {
        return self::query()->inKeyOrder()->readExactly($limit)->get()->all()->values();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withKey(Builder $query, ProfileKey $key): void
    {
        $query->where('key', $key->key);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unretired(Builder $query): void
    {
        $query->whereNull('retired_at');
    }

    /**
     * Names the profile as a reader sees it: its label and the sentence that describes it, empty when none was given.
     */
    public function name(string $label, string $description): void
    {
        $this->label = $label;
        $this->description = $description;
    }

    /**
     * The profiles in the order of their key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inKeyOrder(Builder $query): void
    {
        $query->orderBy('key');
    }
}
