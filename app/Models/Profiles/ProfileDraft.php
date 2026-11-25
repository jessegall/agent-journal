<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\ProfileDraftRefused;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property string $profile_key
 * @property int $revision
 * @property string|null $current_revision_id
 * @property ProfileDraftRevision|null $currentRevision
 */
#[Fillable([
    'profile_key',
    'revision',
    'current_revision_id',
])]
final class ProfileDraft extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string LINK_TYPE = 'core.profile-draft';

    protected function casts(): array
    {
        return ['revision' => 'integer'];
    }

    // ----------[ Transformers ]----------

    public function sourceAt(int $expected): ScriptSource
    {
        $this->assertAtRevision($expected);

        return $this->currentRevision->scriptSource ?? ScriptSource::empty();
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<ProfileDraftRevision, $this>
     */
    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(ProfileDraftRevision::class, 'current_revision_id');
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a draft read against a revision it has moved past.
     *
     * @throws ProfileDraftRefused
     */
    private function assertAtRevision(int $expected): void
    {
        if ($expected !== $this->revision) {
            throw ProfileDraftRefused::stale(ProfileKey::from($this->profile_key), $expected, $this->revision);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The profile's draft, or an empty one at revision 0 when nobody saved one yet.
     */
    public static function of(ProfileKey $profile): self
    {
        return self::query()->with('currentRevision')->ofProfile($profile)->first()
            ?? new self([
                'profile_key' => $profile->key,
                'revision' => 0,
            ]);
    }

    /**
     * @param  list<string>  $profiles
     * @return array<string, self>
     */
    public static function lockForProfiles(array $profiles): array
    {
        if ($profiles === []) {
            return [];
        }

        sort($profiles);

        foreach ($profiles as $profile) {
            $draft = new self();
            $draft->setRawAttributes([
                'id' => (string) Str::ulid(),
                'profile_key' => $profile,
            ]);
            $draft->insertIfAbsent();
        }

        return self::query()
            ->ofProfiles($profiles)
            ->inProfileOrder()
            ->lockForUpdate()
            ->with('currentRevision')
            ->readExactly(count($profiles))
            ->get()
            ->keyBy('profile_key')
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The profile's draft.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, ProfileKey $profile): void
    {
        $query->where('profile_key', $profile->key);
    }

    /**
     * The drafts of the profiles.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $profiles
     */
    #[Scope]
    protected function ofProfiles(Builder $query, array $profiles): void
    {
        $query->whereIn('profile_key', $profiles);
    }

    /**
     * The drafts in the order of their profile key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inProfileOrder(Builder $query): void
    {
        $query->orderBy('profile_key');
    }
}
