<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
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
#[Fillable(['key', 'label', 'description', 'current_revision_id', 'retired_at'])]
final class Profile extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.profile';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'retired_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Queries ]----------

    /**
     * The profile with this key, retired or not, locked until the transaction ends.
     *
     * @throws ProfileMissing
     */
    public static function lockByKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->lockForUpdate()->firstOr(fn () => throw ProfileMissing::for($key));
    }

    /**
     * The profile with this key, retired or not.
     *
     * @throws ProfileMissing
     */
    public static function byKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->firstOr(fn () => throw ProfileMissing::for($key));
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
        return array_values(self::query()->orderBy('key')->readExactly($limit)->get()->all());
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the profile out of new starts; its key and revisions stay.
     */
    public function retire(): void
    {
        $this->retired_at = CarbonImmutable::now();
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
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
}
