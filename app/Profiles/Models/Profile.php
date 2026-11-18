<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A profile's lasting identity: its stable key, its label and which of its revisions is current. A retired profile
 * keeps its key and revisions but is no longer offered to new launches.
 *
 * @property string $id
 * @property string $key
 * @property string $label
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key', 'label', 'current_revision_id', 'retired_at'])]
final class Profile extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

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

    /**
     * Appends the definition as the next revision of the profile with its key, making that profile first when the key
     * is new; a retired profile of that key is current again under the same identity.
     */
    public static function activate(ProfileDefinition $definition, ActorIdentity $author): ProfileRevision
    {
        $profile = self::query()->withKey($definition->key)->lockForUpdate()->first() ?? new self(['key' => $definition->key->key]);
        $profile->label = $definition->label;
        $profile->retired_at = null;
        $profile->save();

        $revision = ProfileRevision::appendTo($profile, $definition, $author);
        $profile->current_revision_id = $revision->id;
        $profile->save();

        return $revision;
    }

    /**
     * The profile with this key, retired or not, locked until the transaction ends.
     *
     * @throws ProfileMissing
     */
    public static function lockByKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->lockForUpdate()->first() ?? throw ProfileMissing::for($key);
    }

    /**
     * The profile with this key, retired or not.
     *
     * @throws ProfileMissing
     */
    public static function byKey(ProfileKey $key): self
    {
        return self::query()->withKey($key)->first() ?? throw ProfileMissing::for($key);
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
        return array_values(self::query()->orderBy('key')->readLimit($limit)->get()->all());
    }

    /**
     * Takes the profile out of new launches; its key and revisions stay.
     */
    public function retire(): void
    {
        $this->retired_at = CarbonImmutable::now();
        $this->save();
    }

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

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
}
