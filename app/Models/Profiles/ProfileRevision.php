<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Casts\ProfileBaseCast;
use App\Casts\ScriptSourceCast;
use App\Casts\SupervisorRoutesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Data\Profiles\ProfileAuthorization;
use App\Enums\ActorType;
use App\Enums\InstancePolicy;
use App\Enums\ModelTier;
use App\Exceptions\ProfileMissing;
use App\Models\Concerns\PreventsRevisionUpdates;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Support\ProfileSnapshots;
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
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $profile_id
 * @property int $revision
 * @property ProfileBase $base
 * @property string $instructions
 * @property ModelTier $preferred_tier
 * @property ?array $skill_allowlist
 * @property array $required_skills
 * @property ProfileStartPolicy $start_policy
 * @property ProfileAuthorization $authorization
 * @property SupervisorRoutes $supervisor
 * @property InstancePolicy $instances
 * @property ScriptSource $script_source
 * @property array $script_commands
 * @property ?array $compiled_script
 * @property ?string $script_definition_digest
 * @property ActorType $author_type
 * @property string $author_id
 * @property Carbon $created_at
 * @property mixed $script attribute
 */
final class ProfileRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PreventsRevisionUpdates;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
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
            'supervisor' => SupervisorRoutesCast::class,
            'instances' => InstancePolicy::class,
            'script_commands' => 'array',
            'script_source' => ScriptSourceCast::class,
            'compiled_script' => 'array',
            'author_type' => ActorType::class,
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
        ActorIdentity $author,
        ScriptSource $source,
        CompiledScript|null $compiled,
    ): self {
        $latest = self::query()->ofProfile($profile)->max('revision');

        $profileRevision = new self();
        $profileRevision->profile_id = $profile->id;
        $profileRevision->revision = (is_numeric($latest) ? (int) $latest : 0) + 1;
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
        $profileRevision->compiled_script = $compiled?->graph;
        $profileRevision->script_definition_digest = $compiled?->definitionDigest;
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
            if ($this->compiled_script === null || $this->script_definition_digest === null) {
                return ProfileScript::empty();
            }

            return new ProfileScript($this->script_source, new CompiledScript($this->compiled_script, $this->script_definition_digest));
        });
    }

    // ----------[ Queries ]----------

    /**
     * The profile's current revision; a profile without an activated revision is missing.
     *
     * @throws ProfileMissing
     */
    public static function currentOf(Profile $profile): self
    {
        return self::query()
            ->ofProfile($profile)
            ->whereKey($profile->current_revision_id)
            ->firstOr(ProfileMissing::throwing()->for(ProfileKey::from($profile->key)));
    }

    /**
     * The profile's revision with this number.
     */
    public static function numbered(Profile $profile, int $revision): self
    {
        return self::query()->ofProfile($profile)->atRevision($revision)->firstOrFail();
    }

    /**
     * @param  list<string>  $keys
     * @return array<string, ScriptSource>
     */
    public static function currentSources(array $keys): array
    {
        if ($keys === []) {
            return [];
        }

        return self::query()->currentOfProfiles($keys)
            ->select([
                'profiles.key as profile_key',
                'profile_revisions.script_source',
                'profile_revisions.script_commands',
            ])
            ->readExactly(count($keys))
            ->get()
            ->mapWithKeys(fn (self $revision) => [
                (string) $revision->getAttribute('profile_key') => $revision->script_source,
            ])->all();
    }

    /**
     * @return list<SupervisorProfile>
     */
    public static function currentSupervisorProfiles(): array
    {
        $profiles = [];

        self::query()
            ->currentOfUnretiredProfiles()
            ->select([
                'profile_revisions.*',
                'profiles.key as profile_key',
            ])
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
