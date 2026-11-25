<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\GrantNotWithheld;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\StartProfileAuthority;
use App\Values\WithheldGrant;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Policies\RulePolicy;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\DomainBoot;
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

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_a_session_of_a_narrowed_profile_is_refused_what_it_withholds_and_the_full_one_is_not(): void
    {
        $this->activate([new WithheldGrant(RulePolicy::class, AccessType::Create)]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);

        $this->actUnder(self::WRITER, 1);
        $this->propose();
        $this->assertFalse($this->snapshot(self::EXECUTOR, 1)->authorization->grants(
            RulePolicy::class,
            AccessType::Create,
        ));
    }

    public function test_withholding_an_ability_the_base_does_not_grant_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->activate([new WithheldGrant(RulePolicy::class, AccessType::Edit)]),
            GrantNotWithheld::class,
        );
    }

    public function test_a_later_activation_leaves_a_running_sessions_grants_as_they_were(): void
    {
        $this->activate([new WithheldGrant(RulePolicy::class, AccessType::Create)]);

        $this->activate([]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);
        $this->actUnder(self::EXECUTOR, 2);
        $this->propose();
    }

    /**
     * @param  list<WithheldGrant>  $withheld
     */
    private function activate(array $withheld): void
    {
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(self::EXECUTOR, ProfileBase::writingHelper(), withheldGrants: $withheld),
            TestProposals::profile(self::WRITER, ProfileBase::writingHelper()),
        )));
    }

    private function actUnder(string $profileKey, int $revision): void
    {
        $agent = Agent::create('Helper', $profileKey, $this->localProject());
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
        $this->app->make(CommandBus::class)->run(new ProposeRuleCommand('Write tests first.', 'It keeps the work honest.'));
    }
}
