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
use App\Models\Support\JournalModel;
use App\Values\ProfileKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $key
 * @property string $label
 * @property string $description
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $retired_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class Profile extends JournalModel implements EventSource, ReadableModel
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
            'retired_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new profile under the key, named and described, before its first revision.
     */
    public static function create(ProfileKey $key, string $label, string $description): self
    {
        $profile = new self();
        $profile->key = $key->key;
        $profile->name($label, $description);
        $profile->saveAndAssert();

        return $profile;
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the profile out of new starts; its key and revisions stay.
     */
    public function retire(): void
    {
        $this->retired_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new ProfileRetired($this->id));
    }

    // ----------[ Predicates ]----------

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    // ----------[ Queries ]----------

    /**
     * The profile with this key, retired or not, locked until the transaction ends.
     *
     * @throws ProfileMissing
     */
    public static function findLockedByKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->lockForUpdate()->firstOr(ProfileMissing::throwing()->for($key));
    }

    /**
     * The profile with this key, retired or not.
     *
     * @throws ProfileMissing
     */
    public static function findByKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->firstOr(ProfileMissing::throwing()->for($key));
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
    public static function findListed(int $limit): array
    {
        return array_values(self::query()->inKeyOrder()->readExactly($limit)->get()->all());
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
