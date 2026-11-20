<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Casts\ProfileAuthorizationCast;
use App\Profiles\Casts\ProfileBaseCast;
use App\Profiles\Casts\ProfileStartPolicyCast;
use App\Profiles\Casts\SupervisorRoutesCast;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRevisionImmutable;
use App\Profiles\Values\ProfileAuthorization;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use App\Profiles\Values\ProfileStartPolicy;
use App\Profiles\Values\SupervisorProfile;
use App\Profiles\Values\SupervisorRoutes;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One numbered, immutable revision of a profile: the built-in profile it starts from, its instructions, default model,
 * skill lists, start policy
 * and who wrote it. A null skill allowlist means every applicable skill; an empty one means none. The start policy
 * is kept in its own columns and read back through ProfileStartPolicyCast.
 *
 * @property string $id
 * @property string $profile_id
 * @property int $revision
 * @property ProfileBase $base
 * @property string $instructions
 * @property string $model
 * @property list<string>|null $skill_allowlist
 * @property list<string> $required_skills
 * @property ProfileStartPolicy $start_policy
 * @property ProfileAuthorization $authorization
 * @property SupervisorRoutes $supervisor
 * @property ActorType $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 */
#[Fillable([
    'profile_id',
    'revision',
    'base',
    'instructions',
    'model',
    'skill_allowlist',
    'required_skills',
    'start_policy',
    'authorization',
    'supervisor',
    'author_type',
    'author_id',
])]
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
            'base' => ProfileBaseCast::class,
            'skill_allowlist' => 'array',
            'required_skills' => 'array',
            'start_policy' => ProfileStartPolicyCast::class,
            'authorization' => ProfileAuthorizationCast::class,
            'supervisor' => SupervisorRoutesCast::class,
            'author_type' => ActorType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw ProfileRevisionImmutable::for($revision->id));
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
            'base' => $definition->base,
            'instructions' => $definition->instructions,
            'model' => $definition->model,
            'skill_allowlist' => $definition->skillAllowlist,
            'required_skills' => $definition->requiredSkills,
            'start_policy' => $definition->start,
            'authorization' => $definition->authorization,
            'supervisor' => $definition->supervisor,
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
    }

    /**
     * The profile's current revision; a profile without an activated revision is missing.
     *
     * @throws ProfileMissing
     */
    public static function currentOf(Profile $profile): self
    {
        return self::query()->ofProfile($profile)->whereKey($profile->current_revision_id)->first()
            ?? throw ProfileMissing::for(ProfileKey::from($profile->key));
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
            'base' => $this->base,
            'instructions' => $this->instructions,
            'model' => $this->model,
            'skillAllowlist' => $this->skill_allowlist,
            'requiredSkills' => $this->required_skills,
            'start' => $this->start_policy,
            'authorization' => $this->authorization,
            'supervisor' => $this->supervisor,
        ]);
    }

    /**
     * @return list<SupervisorProfile>
     */
    public static function currentSupervisorProfiles(): array
    {
        $profiles = [];
        self::query()
            ->join('profiles', 'profiles.current_revision_id', '=', 'profile_revisions.id')
            ->whereNull('profiles.retired_at')
            ->select(['profile_revisions.*', 'profiles.key as profile_key'])
            ->orderBy('profile_revisions.id')
            ->readInChunks(50, function ($revisions) use (&$profiles): void {
                foreach ($revisions as $revision) {
                    $profiles[] = new SupervisorProfile(
                        ProfileKey::from((string) $revision->getAttribute('profile_key')),
                        $revision->supervisor,
                        $revision->start_policy->access,
                    );
                }
            });

        return $profiles;
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
