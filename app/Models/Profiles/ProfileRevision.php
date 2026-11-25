<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Casts\ProfileAuthorizationCast;
use App\Casts\ProfileBaseCast;
use App\Casts\ProfileStartPolicyCast;
use App\Casts\ScriptSourceCast;
use App\Casts\SupervisorRoutesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\InstancePolicy;
use App\Enums\ModelTier;
use App\Exceptions\ProfileMissing;
use App\Models\Concerns\PreventsRevisionUpdates;
use App\Support\ActorIdentity;
use App\Support\ProfileSnapshots;
use App\Values\CompiledScript;
use App\Values\ProfileAuthorization;
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
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\None;

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
 * @property ModelTier $preferred_tier
 * @property list<string>|null $skill_allowlist
 * @property list<string> $required_skills
 * @property ProfileStartPolicy $start_policy
 * @property ProfileAuthorization $authorization
 * @property SupervisorRoutes $supervisor
 * @property InstancePolicy $instances
 * @property ScriptSource $script_source
 * @property array<string, mixed> $script_commands
 * @property array<string, mixed>|null $compiled_script
 * @property string|null $script_definition_digest
 * @property ActorType $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 */
#[Fillable([
    'profile_id',
    'revision',
    'base',
    'instructions',
    'preferred_tier',
    'skill_allowlist',
    'required_skills',
    'start_policy',
    'authorization',
    'supervisor',
    'instances',
    'script_source',
    'script_commands',
    'compiled_script',
    'script_definition_digest',
    'author_type',
    'author_id',
])]
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
            'start_policy' => ProfileStartPolicyCast::class,
            'authorization' => ProfileAuthorizationCast::class,
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

        return self::query()->create([
            'profile_id' => $profile->id,
            'revision' => (is_numeric($latest) ? (int) $latest : 0) + 1,
            'base' => $definition->base,
            'instructions' => $definition->instructions,
            'preferred_tier' => $definition->preferredTier,
            'skill_allowlist' => $definition->skillAllowlist,
            'required_skills' => $definition->requiredSkills,
            'start_policy' => $definition->start,
            'authorization' => $definition->authorization,
            'supervisor' => $definition->supervisor,
            'instances' => $definition->instances,
            'script_source' => $source,
            'compiled_script' => $compiled?->graph,
            'script_definition_digest' => $compiled?->definitionDigest,
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
    }

    // ----------[ Transformers ]----------

    public function snapshot(ProfileKey $key): ProfileSnapshot
    {
        return ProfileSnapshots::of($this, $key);
    }

    /**
     * The script this revision runs; a revision without one runs the empty script, which handles nothing.
     */
    public function script(): ProfileScript
    {
        if ($this->compiled_script === null || $this->script_definition_digest === null) {
            return ProfileScript::empty();
        }

        $compiled = new CompiledScript($this->compiled_script, $this->script_definition_digest);

        return new ProfileScript($this->script_source, $compiled);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a profile whose current revision is not there.
     *
     * @phpstan-assert self $row
     *
     * @throws ProfileMissing
     */
    private static function assertCurrentFound(self|null $row, Profile $profile): void
    {
        if ($row === null) {
            throw ProfileMissing::for(ProfileKey::from($profile->key));
        }
    }

    // ----------[ Queries ]----------

    /**
     * The profile's current revision; a profile without an activated revision is missing.
     *
     * @throws ProfileMissing
     */
    public static function currentOf(Profile $profile): self
    {
        $row = self::query()->ofProfile($profile)->whereKey($profile->current_revision_id)->first();
        self::assertCurrentFound($row, $profile);

        return $row;
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
