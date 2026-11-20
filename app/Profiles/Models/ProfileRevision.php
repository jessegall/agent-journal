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
use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Models\Concerns\PreventsRevisionUpdates;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\ProfileAuthorization;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileScript;
use App\Profiles\Values\ProfileSnapshot;
use App\Profiles\Values\ProfileStartPolicy;
use App\Profiles\Values\ScriptSource;
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
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

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
 * @property InstancePolicy $instances
 * @property string $script_source
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
    'model',
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
    use BoundedReads, HasUlids, Linkable, PreventsRevisionUpdates;

    public const string LINK_TYPE = 'core.profile-revision';

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

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
            'instances' => InstancePolicy::class,
            'script_commands' => 'array',
            'compiled_script' => 'array',
            'author_type' => ActorType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Appends the definition as the profile's next revision, numbered after every earlier one; the caller holds the
     * profile's lock, so two revisions never take one number.
     */
    public static function appendTo(
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
            'model' => $definition->model,
            'skill_allowlist' => $definition->skillAllowlist,
            'required_skills' => $definition->requiredSkills,
            'start_policy' => $definition->start,
            'authorization' => $definition->authorization,
            'supervisor' => $definition->supervisor,
            'instances' => $definition->instances,
            'script_source' => $source->text,
            'script_commands' => $source->definitions(),
            'compiled_script' => $compiled?->graph,
            'script_definition_digest' => $compiled?->definitionDigest,
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The profile's current revision; a profile without an activated revision is missing.
     *
     * @throws ProfileMissing
     */
    public static function currentOf(Profile $profile): self
    {
        return self::query()->ofProfile($profile)->whereKey($profile->current_revision_id)->firstOr(
            fn () => throw ProfileMissing::for(ProfileKey::from($profile->key)),
        );
    }

    /**
     * The profile's revision with this number.
     */
    public static function numbered(Profile $profile, int $revision): self
    {
        return self::query()->ofProfile($profile)->where('revision', $revision)->firstOrFail();
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

        return self::query()->join('profiles', 'profiles.current_revision_id', '=', 'profile_revisions.id')
            ->whereIn('profiles.key', $keys)
            ->select([
                'profiles.key as profile_key',
                'profile_revisions.script_source',
                'profile_revisions.script_commands',
            ])
            ->readLimit(count($keys))
            ->get()
            ->mapWithKeys(fn (self $revision) => [
                (string) $revision->getAttribute('profile_key') => $revision->scriptSource(),
            ])->all();
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
                        $revision->authorization,
                    );
                }
            });

        return $profiles;
    }

    // ----------[ Answers ]----------

    public function scriptSource(): ScriptSource
    {
        return ScriptSource::fromDefinitions($this->script_source, $this->script_commands);
    }

    /**
     * The script this revision runs; a revision without one has none.
     *
     * @return Option<ProfileScript>
     */
    public function script(): Option
    {
        if ($this->compiled_script === null || $this->script_definition_digest === null) {
            return None::create();
        }

        return new Some(new ProfileScript(
            $this->scriptSource(),
            new CompiledScript($this->compiled_script, $this->script_definition_digest),
        ));
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
            'instances' => $this->instances,
        ]);
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
}
