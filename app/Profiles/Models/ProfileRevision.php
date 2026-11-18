<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileRevisionImmutable;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One numbered, immutable revision of a profile: its type, instructions, model and skill lists, and who wrote it. A
 * null skill allowlist means every applicable skill; an empty one means none.
 *
 * @property string $id
 * @property string $profile_id
 * @property int $revision
 * @property ProfileType $type
 * @property string $instructions
 * @property string $model
 * @property list<string>|null $skill_allowlist
 * @property list<string> $required_skills
 * @property ActorType $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 */
#[Fillable(['profile_id', 'revision', 'type', 'instructions', 'model', 'skill_allowlist', 'required_skills', 'author_type', 'author_id'])]
final class ProfileRevision extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.profile-revision';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'type' => ProfileType::class,
            'skill_allowlist' => 'array',
            'required_skills' => 'array',
            'author_type' => ActorType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(fn (self $revision) => throw ProfileRevisionImmutable::for($revision->id));
    }

    /**
     * Appends the definition as the profile's next revision, numbered after every earlier one; the caller holds the
     * profile's lock, so two revisions never take one number.
     */
    public static function appendTo(Profile $profile, ProfileDefinition $definition, ActorIdentity $author): self
    {
        $latest = self::query()->ofProfile($profile)->max('revision');

        return self::query()->create([
            'profile_id' => $profile->id,
            'revision' => (is_numeric($latest) ? (int) $latest : 0) + 1,
            'type' => $definition->type,
            'instructions' => $definition->instructions,
            'model' => $definition->model,
            'skill_allowlist' => $definition->skillAllowlist,
            'required_skills' => $definition->requiredSkills,
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
    }

    /**
     * The profile's current revision.
     */
    public static function currentOf(Profile $profile): self
    {
        return self::query()->ofProfile($profile)->whereKey($profile->current_revision_id)->firstOrFail();
    }

    /**
     * The profile's revision with this number.
     */
    public static function numbered(Profile $profile, int $revision): self
    {
        return self::query()->ofProfile($profile)->where('revision', $revision)->firstOrFail();
    }

    public function snapshot(ProfileKey $key): ProfileSnapshot
    {
        return ProfileSnapshot::from([
            'key' => $key,
            'revision' => $this->revision,
            'type' => $this->type,
            'instructions' => $this->instructions,
            'model' => $this->model,
            'skillAllowlist' => $this->skill_allowlist,
            'requiredSkills' => $this->required_skills,
        ]);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, Profile $profile): void
    {
        $query->where('profile_id', $profile->id);
    }
}
