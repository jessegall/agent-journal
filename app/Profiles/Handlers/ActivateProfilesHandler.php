<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Support\ContainerAdmission;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ScriptCompilation;
use App\Profiles\Contracts\SupervisorDefinitions;
use App\Profiles\Enums\ProfileChangeType;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileDraft;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Support\PolicyResolver;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ScriptDiff;
use App\Profiles\Values\ScriptSource;

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
     * @throws AbilityNotRegistered
     */
    public function handle(ActivateProfiles $command): ProfileActivation
    {
        return $this->activate($command->proposal, $command->dispatchedBy(), $command->drafts);
    }

    /**
     * Activates the proposal's profiles with the actor as their author; the journal's own install of its built-in
     * profiles comes here directly.
     *
     * @throws ProfilePolicyRefused
     * @throws AbilityNotRegistered
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
            $definition->authorization->requireGrantableIn($this->catalogue);
            $this->assertContainerSupport($definition);
        }

        $coverage = $this->supervisors->validate(
            array_map(fn (ProfileDefinition $definition) => $definition->supervisorProfile(), $definitions),
        );
        $changes = array_map($this->changeOf(...), $definitions);
        $author = ActorIdentity::of($actor);
        $current = ProfileRevision::currentSources($keys);
        $compiled = array_map(
            fn (ProfileDefinition $definition, ScriptSource $source) =>
                $this->scripts->compileForProfile($source, $definition->start->access),
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
                new ScriptDiff($current[$definition->key->key] ?? new ScriptSource(), $source),
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
     * @param list<string> $keys
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

    /** @param list<\App\Profiles\Values\SupervisorCoverage> $coverage */
    private function publish(
        ProfileDefinition $definition,
        ActorIdentity $author,
        ProfileChangeType $change,
        ScriptDiff $diff,
        CompiledScript $script,
        array $coverage,
    ): ActivatedProfile {
        $revision = Profile::activate($definition, $author, $diff->after, $script)->revision;

        if ($change === ProfileChangeType::Unchanged && $diff->before != $diff->after) {
            $change = ProfileChangeType::Changed;
        }

        return new ActivatedProfile($definition->key, $revision, $change, $coverage, $diff);
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

        if ($start->execution->mode === ExecutionModeType::RequiredContainer && $start->program !== null) {
            $this->containers->assertSupported($start->program);
        }
    }
}
