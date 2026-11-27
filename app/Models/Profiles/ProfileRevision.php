<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Casts\ProfileBaseCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Exceptions\ProfileMissing;
use App\Models\Concerns\PreventsRevisionUpdates;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Profiles\Data\ProfileAuthorization;
use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Enums\ModelTier;
use App\Profiles\ProfileSnapshots;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\CompiledScript;
use App\Values\ProfileBase;
use App\Values\ProfileDefinition;
use App\Values\ProfileKey;
use App\Values\ProfileScript;
use App\Values\ProfileSnapshot;
use App\Values\ProfileStartPolicy;
use App\Values\ScriptSource;
use App\Values\SupervisorProfile;
use App\Values\SupervisorRoutes;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $profile_id
 * @property int $revision
 * @property ProfileBase $base
 * @property string $instructions
 * @property ModelTier $preferred_tier
 * @property list<string>|null $skill_allowlist
 * @property list<string> $required_skills
 * @property ProfileStartPolicy $start_policy
 * @property ProfileAuthorization $authorization
 * @property SupervisorRoutes $supervisor
 * @property InstancePolicy $instances
 * @property ScriptSource $script_source
 * @property CompiledScript|null $compiled_script
 * @property string $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 * @property-read mixed $script
 *
 * @mixin \Eloquent
 */
final class ProfileRevision extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;
    use PreventsRevisionUpdates;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     *
     * @column skill_allowlist list<string>|null
     * @column required_skills list<string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'base' => ProfileBaseCast::class,
            'preferred_tier' => ModelTier::class,
            'skill_allowlist' => 'array',
            'required_skills' => 'array',
            'start_policy' => ProfileStartPolicy::class,
            'authorization' => ProfileAuthorization::class,
            'supervisor' => SupervisorRoutes::class,
            'instances' => InstancePolicy::class,
            'script_source' => ScriptSource::class,
            'compiled_script' => CompiledScript::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Appends the definition as the profile's next revision, numbered after every earlier one; the caller holds the
     * profile's lock, so two revisions never take one number.
     */
    public static function create(
        Profile $profile,
        ProfileDefinition $definition,
        ActorReference $author,
        ScriptSource $source,
        CompiledScript|null $compiled,
    ): self {
        $profileRevision = new self();
        $profileRevision->profile_id = $profile->id;
        $profileRevision->revision = self::resolveNextRevision($profile);
        $profileRevision->base = $definition->base;
        $profileRevision->instructions = $definition->instructions;
        $profileRevision->preferred_tier = $definition->preferredTier;
        $profileRevision->skill_allowlist = $definition->skillAllowlist;
        $profileRevision->required_skills = $definition->requiredSkills;
        $profileRevision->start_policy = $definition->start;
        $profileRevision->authorization = $definition->authorization;
        $profileRevision->supervisor = $definition->supervisor;
        $profileRevision->instances = $definition->instances;
        $profileRevision->script_source = $source;
        $profileRevision->compiled_script = $compiled;
        $profileRevision->author_type = $author->type;
        $profileRevision->author_id = $author->id;
        $profileRevision->save();

        return $profileRevision;
    }

    // ----------[ Transformers ]----------

    public function snapshot(ProfileKey $key): ProfileSnapshot
    {
        return ProfileSnapshots::of($this, $key);
    }

    // ----------[ Accessors ]----------

    /**
     * The script this revision runs; a revision without one runs the empty script, which handles nothing.
     *
     * @return Attribute<ProfileScript, never>
     */
    protected function script(): Attribute
    {
        return Accessor::get(function () {
            if ($this->compiled_script === null) {
                return ProfileScript::empty();
            }

            return new ProfileScript($this->script_source, $this->compiled_script);
        });
    }

    // ----------[ Queries ]----------

    /**
     * The profile's current revision; a profile without an activated revision is missing.
     *
     * @throws ProfileMissing
     */
    public static function findCurrentOf(Profile $profile): self
    {
        return self::query()
            ->ofProfile($profile)
            ->whereKey($profile->current_revision_id)
            ->firstOr(ProfileMissing::throwing()->for(ProfileKey::from($profile->key)));
    }

    /**
     * The profile's revision with this number.
     */
    public static function findNumbered(Profile $profile, int $revision): self
    {
        return self::query()->ofProfile($profile)->atRevision($revision)->firstOrFail();
    }

    /**
     * @param  list<string>  $keys
     * @return array<string, ScriptSource>
     */
    public static function resolveCurrentSources(array $keys): array
    {
        if ($keys === []) {
            return [];
        }

        return self::query()->currentOfProfiles($keys)
            ->select(['profiles.key as profile_key', 'profile_revisions.script_source'])
            ->readExactlyOf($keys)
            ->get()
            ->mapWithKeys(fn (self $revision) => [
                (string) $revision->getAttribute('profile_key') => $revision->script_source,
            ])->all();
    }

    /**
     * @return list<SupervisorProfile>
     */
    public static function resolveCurrentSupervisorProfiles(): array
    {
        $profiles = [];

        self::query()
            ->currentOfUnretiredProfiles()
            ->select(['profile_revisions.*', 'profiles.key as profile_key'])
            ->readInChunks(50, function ($revisions) use (&$profiles): void {
                foreach ($revisions as $revision) {
                    $profiles[] = new SupervisorProfile(
                        ProfileKey::from((string) $revision->getAttribute('profile_key')),
                        $revision->supervisor,
                        $revision->authorization,
                    );
                }
            });

        return $profiles;
    }

    /**
     * The revision the profile's next definition takes: one past its newest.
     */
    public static function resolveNextRevision(Profile $profile): int
    {
        return (int) self::query()->ofProfile($profile)->max('revision') + 1;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, Profile $profile): void
    {
        $query->where('profile_id', $profile->id);
    }

    /**
     * The revision of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function atRevision(Builder $query, int $revision): void
    {
        $query->where('revision', $revision);
    }

    /**
     * The current revision of each profile of those keys, joined to its profile.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $keys
     */
    #[Scope]
    protected function currentOfProfiles(Builder $query, array $keys): void
    {
        $query->join('profiles', 'profiles.current_revision_id', '=', 'profile_revisions.id')
            ->whereIn('profiles.key', $keys);
    }

    /**
     * The current revision of each profile not retired, joined to its profile, in id order.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function currentOfUnretiredProfiles(Builder $query): void
    {
        $query->join('profiles', 'profiles.current_revision_id', '=', 'profile_revisions.id')
            ->whereNull('profiles.retired_at')
            ->orderBy('profile_revisions.id');
    }
}
