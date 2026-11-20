<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\AbilityNotWithheld;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use App\Profiles\Values\StartProfileAuthority;
use App\Profiles\Values\WithheldAbility;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Policies\RulePolicy;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A job's journal permissions are its pinned profile revision's grants: a profile withholds abilities its base would
 * give, so a session started from it is refused those commands while an unnarrowed profile of the same base is not;
 * a withheld ability the base does not grant is refused at activation; and a later activation changes no running
 * session's grants.
 */
final class JobPermissionTest extends TestCase
{
    use HasContainerSupport;
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string EXECUTOR = 'journal-executor';

    private const string WRITER = 'journal-writer';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_a_session_of_a_narrowed_profile_is_refused_what_it_withholds_and_the_full_one_is_not(): void
    {
        $this->activate([new WithheldAbility(RulePolicy::class, RuleAbility::Propose->value)]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);

        $this->actUnder(self::WRITER, 1);
        $this->propose();
        $this->assertFalse($this->snapshot(self::EXECUTOR, 1)->authorization->grants(
            RulePolicy::class,
            RuleAbility::Propose,
        ));
    }

    public function test_withholding_an_ability_the_base_does_not_grant_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->activate([new WithheldAbility(RulePolicy::class, RuleAbility::Approve->value)]),
            AbilityNotWithheld::class,
        );
    }

    public function test_a_later_activation_leaves_a_running_sessions_grants_as_they_were(): void
    {
        $this->activate([new WithheldAbility(RulePolicy::class, RuleAbility::Propose->value)]);

        $this->activate([]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);
        $this->actUnder(self::EXECUTOR, 2);
        $this->propose();
    }

    /**
     * @param  list<WithheldAbility>  $withheld
     */
    private function activate(array $withheld): void
    {
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile(self::EXECUTOR, ProfileBase::writingHelper(), withheldAbilities: $withheld),
            TestProposals::profile(self::WRITER, ProfileBase::writingHelper()),
        )));
    }

    private function actUnder(string $profileKey, int $revision): void
    {
        $agent = Agent::named('Helper', $profileKey);
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent->id),
            new StartProfileAuthority($this->snapshot($profileKey, $revision)),
        );
    }

    private function snapshot(string $profileKey, int $revision): ProfileSnapshot
    {
        return $this->app->make(ProfileResolver::class)->snapshotAt(ProfileKey::from($profileKey), $revision);
    }

    private function propose(): void
    {
        $this->app->make(CommandBus::class)->run(new ProposeRule('Write tests first.', 'It keeps the work honest.'));
    }
}
