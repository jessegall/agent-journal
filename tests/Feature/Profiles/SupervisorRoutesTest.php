<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Enums\SupervisorCoverageType;
use App\Profiles\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Commands\ChangeSupervisor;
use App\Supervision\Enums\OwnerRouteType;
use App\Supervision\Exceptions\SupervisorRouteRefused;
use App\Supervision\Models\SupervisorChange;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Support\SupervisorOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class SupervisorRoutesTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const array PROFILE = ['base' => 'writing-helper', 'model' => 'sonnet'];

    public function test_shipped_routes_are_stored_and_their_supervisors_admit_every_required_command(): void
    {
        $activation = $this->activate((array) config('profiles'));
        $profiles = $this->app->make(ProfileResolver::class);
        $reviewer = $profiles->snapshotFor(ProfileKey::from('journal-code-reviewer'));
        $worker = $profiles->snapshotFor(ProfileKey::from('journal-worker'));

        $this->assertSame('profile:journal-code-reviewer', $worker->supervisor->default->key);
        $this->assertSame('profile:journal-main', $reviewer->supervisor->targetFor(AskTypeKey::from('question'))->key);
        $this->assertSame(
            'profile:journal-merger',
            $reviewer->supervisor->targetFor(AskTypeKey::from('merge.ready'))->key,
        );

        $byKey = collect($activation->profiles)->keyBy(fn (ActivatedProfile $profile) => $profile->key->key);
        $coverage = $byKey['journal-worker']->supervisorCoverage;
        $this->assertNotContains(SupervisorCoverageType::Unsupported, array_column($coverage, 'status'));
    }

    public function test_mixed_type_routes_are_valid_but_a_reachable_cycle_saves_nothing(): void
    {
        $routes = [
            'route-a' => [...self::PROFILE, 'supervisor' => ['default' => 'owner', 'question' => 'profile:route-b']],
            'route-b' => [...self::PROFILE, 'supervisor' => ['default' => 'owner', 'stuck' => 'profile:route-a']],
        ];
        $this->activate(['profiles' => $routes]);
        $routes['route-b']['supervisor']['question'] = 'profile:route-a';

        $this->assertThrows(
            fn () => $this->activate(['profiles' => $routes]),
            SupervisorRouteRefused::class,
            'The question supervisor route has a cycle:',
        );

        $saved = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('route-b'));
        $this->assertSame(1, $saved->revision);
        $this->assertSame('owner', $saved->supervisor->targetFor(AskTypeKey::from('question'))->key);
        $this->assertSame('profile:route-a', $saved->supervisor->targetFor(AskTypeKey::from('stuck'))->key);
    }

    public function test_unknown_targets_and_missing_defaults_are_refused(): void
    {
        foreach ([
            ['question' => 'owner'],
            ['default' => null],
            ['default' => 'profile:missing'],
            ['default' => 'owner', 'unknown' => 'owner'],
        ] as $supervisor) {
            $this->assertThrows(
                fn () => $this->activate(
                    ['profiles' => ['route-a' => [...self::PROFILE, 'supervisor' => $supervisor]]],
                ),
                SupervisorRouteInvalid::class,
            );
        }
    }

    public function test_changing_a_route_keeps_other_versions_and_records_the_author(): void
    {
        $this->activate((array) config('profiles'));
        $agent = Agent::create('Worker', 'journal-worker');
        $actor = ActorIdentity::of(ActorContext::forAgent($agent->id));
        $question = AskTypeKey::from('question');
        $receipt = $this->app->make(CommandBus::class)->run(
            new ChangeSupervisor($actor, SupervisorTarget::parse('profile:journal-main'), 0, $question),
        );
        $link = SupervisorLink::query()->ownedBy($actor)->firstOrFail();

        $this->assertSame(1, $receipt->version);
        $this->assertSame(1, $link->versionFor($question));
        $this->assertSame(0, $link->versionFor(AskTypeKey::from('stuck')));
        $this->assertSame('profile:journal-code-reviewer', $link->routes->default->key);
        $this->assertSame(1, SupervisorChange::query()->count());
    }

    public function test_the_owner_target_has_an_explicit_missing_outcome(): void
    {
        $this->mock(JournalAdmission::class)->shouldReceive('owner')->andThrow(ConsoleOwnerMissing::forConsole());

        $this->assertSame(OwnerRouteType::NoOwner, $this->app->make(SupervisorOwner::class)->resolve()->type);
    }

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activate(array $configuration): ProfileActivation
    {
        $this->startTestUserRequest(1);

        return $this->app->make(CommandBus::class)->run(new ActivateProfiles(
            ProfileProposal::fromConfiguration(['revision' => 1, ...$configuration]),
        ));
    }
}
