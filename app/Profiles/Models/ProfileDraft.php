<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Exceptions\ProfileDraftRefused;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
#[Fillable(['profile_key', 'revision', 'current_revision_id'])]
final class ProfileDraft extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.profile-draft';

    protected function casts(): array
    {
        return ['revision' => 'integer'];
    }

    /**
     * The profile's draft, or an empty one at revision 0 when nobody saved one yet.
     */
    public static function of(ProfileKey $profile): self
    {
        return self::query()->with('currentRevision')->where('profile_key', $profile->key)->first()
            ?? new self(['profile_key' => $profile->key, 'revision' => 0]);
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
        $now = CarbonImmutable::now();
        self::query()->insertOrIgnore(array_map(
            fn (string $profile) => [
                'id' => (string) Str::ulid(),
                'profile_key' => $profile,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            $profiles,
        ));

        return self::query()
            ->whereIn('profile_key', $profiles)
            ->orderBy('profile_key')
            ->lockForUpdate()
            ->with('currentRevision')
            ->readLimit(count($profiles))
            ->get()
            ->keyBy('profile_key')
            ->all();
    }

    /**
     * @return BelongsTo<ProfileDraftRevision, $this>
     */
    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(ProfileDraftRevision::class, 'current_revision_id');
    }

    public function sourceAt(int $expected): ScriptSource
    {
        if ($expected !== $this->revision) {
            throw ProfileDraftRefused::stale(ProfileKey::from($this->profile_key), $expected, $this->revision);
        }

        return $this->currentRevision?->scriptSource() ?? ScriptSource::empty();
    }

    public static function saveFor(ProfileKey $profile, int $expected, ScriptSource $source, ActorIdentity $author): int
    {
        $draft = self::lockForProfiles([$profile->key])[$profile->key];
        $draft->sourceAt($expected);
        $revision = ProfileDraftRevision::appendTo($draft, $source, $author);
        $draft->revision = $revision->revision;
        $draft->current_revision_id = $revision->id;
        $draft->save();

        return $revision->revision;
    }
}
