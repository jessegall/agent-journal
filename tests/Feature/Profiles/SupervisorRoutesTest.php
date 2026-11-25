<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Asks\OwnerRouteType;
use App\Enums\Asks\SupervisorCoverageType;
use App\Exceptions\ConsoleOwnerMissing;
use App\Exceptions\SupervisorRouteInvalid;
use App\Exceptions\SupervisorRouteRefused;
use App\Models\Agents\Agent;
use App\Models\Asks\SupervisorChange;
use App\Models\Asks\SupervisorLink;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ProfileProposal;
use App\Support\SupervisorOwner;
use App\Values\ActivatedProfile;
use App\Values\AskTypeKey;
use App\Values\ProfileActivation;
use App\Values\ProfileKey;
use App\Values\SupervisorTarget;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class SupervisorRoutesTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string ROUTE_CYCLE = 'The question supervisor route has a cycle:';

    private const array PROFILE = ['base' => 'writing-helper', 'tier' => 2];

    public function test_shipped_routes_are_stored_and_their_supervisors_admit_every_required_command(): void
    {
        $activation = $this->activate((array) config('profiles'));
        $profiles = $this->app->make(ProfileResolver::class);
        $reviewer = $profiles->snapshotFor(ProfileKey::from('journal-code-reviewer'));
        $worker = $profiles->snapshotFor(ProfileKey::from('journal-worker'));

        $this->assertSame('profile:journal-code-reviewer', $worker->supervisor->default->key);
        $this->assertSame('profile:journal-main', $reviewer->supervisor->targetFor(AskTypeKey::of('question'))->key);
        $this->assertSame(
            'profile:journal-merger',
            $reviewer->supervisor->targetFor(AskTypeKey::of('merge.ready'))->key,
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
            self::ROUTE_CYCLE,
        );

        $saved = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('route-b'));
        $this->assertSame(1, $saved->revision);
        $this->assertSame('owner', $saved->supervisor->targetFor(AskTypeKey::of('question'))->key);
        $this->assertSame('profile:route-a', $saved->supervisor->targetFor(AskTypeKey::of('stuck'))->key);
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
        $question = AskTypeKey::of('question');
        $receipt = $this->app->make(CommandBus::class)->run(
            new ChangeSupervisorCommand($actor, SupervisorTarget::parse('profile:journal-main'), 0, $question),
        );
        $link = SupervisorLink::query()->ownedBy($actor)->firstOrFail();

        $this->assertSame(1, $receipt->version);
        $this->assertSame(1, $link->versionFor($question));
        $this->assertSame(0, $link->versionFor(AskTypeKey::of('stuck')));
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

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(
            ProfileProposal::fromConfiguration(['revision' => 1, ...$configuration]),
        ));
    }
}
