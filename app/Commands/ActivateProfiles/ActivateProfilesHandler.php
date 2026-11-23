<?php

declare(strict_types=1);

namespace App\Commands\ActivateProfiles;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Processes\SupervisorDefinitions;
use App\Contracts\Scripts\ScriptCompilation;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\ExecutionModeType;
use App\Enums\ProfileChangeType;
use App\Exceptions\GrantNotRegistered;
use App\Exceptions\ProfilePolicyRefused;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileDraft;
use App\Models\Profiles\ProfileRevision;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ContainerAdmission;
use App\Support\PolicyResolver;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Values\ActivatedProfile;
use App\Values\CompiledScript;
use App\Values\DraftExpectations;
use App\Values\ProfileActivation;
use App\Values\ProfileDefinition;
use App\Values\ScriptDiff;
use App\Values\ScriptSource;
use App\Values\SupervisorCoverage;

/**
 * Resolves and checks the whole proposal before writing anything, then appends one revision per profile, every one
 * carrying the hash of the proposal it came from, and answers how each differs from the revision that was active.
 */
final readonly class ActivateProfilesHandler implements CommandHandler
{
    public function __construct(
        private PolicyResolver $resolver,
        private ProfileResolver $profiles,
        private PolicyCatalogue $catalogue,
        private SupervisorDefinitions $supervisors,
        private ContainerAdmission $containers,
        private ScriptCompilation $scripts,
    ) {}

    /**
     * @throws ProfilePolicyRefused
     * @throws GrantNotRegistered
     */
    public function handle(ActivateProfilesCommand $command): ProfileActivation
    {
        return $this->activate($command->proposal, $command->dispatchedBy(), $command->drafts);
    }

    /**
     * Activates the proposal's profiles with the actor as their author; the journal's own install of its built-in
     * profiles comes here directly.
     *
     * @throws ProfilePolicyRefused
     * @throws GrantNotRegistered
     */
    public function activate(
        ProfileProposal $proposal,
        ActorContext $actor,
        DraftExpectations $expected = new DraftExpectations(),
    ): ProfileActivation {
        $hash = hash('sha256', json_encode($proposal, JSON_THROW_ON_ERROR));
        $keys = array_map(fn (ProposedProfile $profile) => $profile->key->key, $proposal->profiles);

        foreach (array_diff_assoc($keys, array_unique($keys)) as $index => $repeated) {
            throw ProfilePolicyRefused::repeatedKey($proposal->profiles[$index]->key);
        }

        $sources = self::draftSources($proposal, $expected, $keys);

        $definitions = array_map(
            fn (ProposedProfile $profile) => $this->resolver->resolve($proposal, $profile, $hash),
            $proposal->profiles,
        );

        foreach ($definitions as $definition) {
            $definition->authorization->assertGrantableIn($this->catalogue);
            $this->assertContainerSupport($definition);
        }

        $coverage = $this->supervisors->validate(
            array_map(fn (ProfileDefinition $definition) => $definition->supervisorProfile(), $definitions),
        );

        $changes = array_map($this->changeOf(...), $definitions);
        $author = ActorIdentity::of($actor);
        $current = ProfileRevision::currentSources($keys);

        $compiled = array_map(
            fn (
                ProfileDefinition $definition,
                ScriptSource $source,
            ) => $this->scripts->compileForProfile($source, $definition),
            $definitions,
            $sources,
        );

        return new ProfileActivation(array_map(
            fn (
                ProfileDefinition $definition,
                ProfileChangeType $change,
                ScriptSource $source,
                CompiledScript $script,
            ) => $this->publish(
                $definition,
                $author,
                $change,
                new ScriptDiff($current[$definition->key->key] ?? ScriptSource::empty(), $source),
                $script,
                $coverage[$definition->key->key],
            ),
            $definitions,
            $changes,
            $sources,
            $compiled,
        ), $hash);
    }

    /**
     * @param  list<string>  $keys
     * @return list<ScriptSource>
     */
    private static function draftSources(ProfileProposal $proposal, DraftExpectations $expected, array $keys): array
    {
        $drafts = ProfileDraft::lockForProfiles($keys);
        $sources = [];

        foreach ($proposal->profiles as $profile) {
            $sources[] = $drafts[$profile->key->key]->sourceAt($expected->revisionOf($profile->key));
        }

        return $sources;
    }

    /**
     * @param  list<SupervisorCoverage>  $coverage
     */
    private function publish(
        ProfileDefinition $definition,
        ActorIdentity $author,
        ProfileChangeType $change,
        ScriptDiff $diff,
        CompiledScript $script,
        array $coverage,
    ): ActivatedProfile {
        $revision = $this->activateDefinition($definition, $author, $diff->after, $script)->revision;

        $publishedChange = $change === ProfileChangeType::Unchanged && $diff->before != $diff->after
            ? ProfileChangeType::Changed
            : $change;

        return new ActivatedProfile($definition->key, $revision, $publishedChange, $coverage, $diff);
    }

    private function changeOf(ProfileDefinition $definition): ProfileChangeType
    {
        if (! $this->profiles->has($definition->key)) {
            return ProfileChangeType::Added;
        }

        return $definition->differsFrom($this->profiles->snapshotFor($definition->key))
            ? ProfileChangeType::Changed
            : ProfileChangeType::Unchanged;
    }

    private function assertContainerSupport(ProfileDefinition $definition): void
    {
        $start = $definition->start;

        if ($start->execution->mode === ExecutionModeType::RequiredContainer && $start->driver !== null) {
            $this->containers->assertSupported($start->driver);
        }
    }

    /**
     * Appends the definition as the next revision of the profile with its key, making that profile first when the key
     * is new; a retired profile of that key is current again under the same identity.
     */
    private function activateDefinition(
        ProfileDefinition $definition,
        ActorIdentity $author,
        ScriptSource $source = new ScriptSource(''),
        CompiledScript|null $compiled = null,
    ): ProfileRevision {
        $profile = Profile::query()->withKey($definition->key)->lockForUpdate()->first()
            ?? new Profile(['key' => $definition->key->key]);

        $profile->name($definition->label, $definition->description);
        $profile->retired_at = null;
        $profile->save();

        $revision = ProfileRevision::create($profile, $definition, $author, $source, $compiled);
        $profile->current_revision_id = $revision->id;
        $profile->save();

        return $revision;
    }
}
