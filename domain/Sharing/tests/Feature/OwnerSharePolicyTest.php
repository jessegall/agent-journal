<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Actors\Actor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Messages\AdmittedRecipients;
use App\Contracts\Sharing\SharePolicy;
use App\Exceptions\SharingNotAllowed;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\GatewaySettings;
use Domain\Sharing\Support\OwnerSharePolicy;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareProposal;
use App\Support\ShareRecordRegistry;
use Domain\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Domains\Pamphlets\PamphletsDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Domain\Sharing\Tests\TestCase;

/**
 * The owner's share policy: only the current configured owner manages shares, an owner change ends every earlier
 * grant while the new owner still manages the old shares, and disclosure is the record provider's answer.
 */
final class OwnerSharePolicyTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;

    private string $ownerId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->ownerId = TestIds::of(1);
        $admission = new class($this) implements AdmittedRecipients, JournalAdmission
        {
            public function __construct(private readonly OwnerSharePolicyTest $test) {}

            public function admits(Actor $actor): bool
            {
                return ActorIdentity::of($actor)->isSameAs(ActorIdentity::of($this->owner()));
            }

            public function owner(): ActorContext
            {
                return ActorContext::forUser($this->test->ownerId());
            }

            public function userIds(): array
            {
                return [$this->test->ownerId()];
            }
        };
        $this->app->instance(JournalAdmission::class, $admission);
        $this->app->instance(AdmittedRecipients::class, $admission);
    }

    public function ownerId(): string
    {
        return $this->ownerId;
    }

    public function test_only_the_configured_owner_manages_shares(): void
    {
        $policy = $this->app->make(SharePolicy::class);

        $this->assertTrue($policy->mayManage(ActorContext::forUser($this->ownerId)));
        $this->assertFalse($policy->mayManage(TestActors::user(2)));
        $this->assertFalse($policy->mayManage(ActorContext::forAgent($this->ownerId)));
        $this->assertThrows(fn () => $policy->assertManager(TestActors::user(2)), SharingNotAllowed::class);
        $this->assertThrows(
            fn () => $policy->assertManager(ActorContext::forAgent(TestIds::of(3))),
            SharingNotAllowed::class,
        );
    }

    public function test_an_owner_change_ends_earlier_grants_and_the_new_owner_still_manages(): void
    {
        $policy = $this->app->make(OwnerSharePolicy::class);
        $share = Share::create(
            TestActors::record('pamphlets.pamphlet', 4),
            CarbonImmutable::now()->addDays(7),
            new ShareGrant(
                $this->ownerId,
                $this->configuration()->id,
                $this->configuration()->configuration_version,
                ShareToken::generate(),
            ),
        );
        $proposal = Share::create(
            TestActors::record('pamphlets.pamphlet', 4),
            CarbonImmutable::now()->addDays(7),
            new ShareProposal(TestActors::agentIdentity(5)),
        );

        $this->assertTrue($policy->grantHolds($share));
        $this->assertFalse($policy->grantHolds($proposal));

        $this->ownerId = TestIds::of(2);

        $this->assertFalse($policy->grantHolds($share));
        $this->assertTrue($policy->mayManage(TestActors::user(2)));
        $this->assertFalse($policy->mayManage(TestActors::user(1)));
    }

    public function test_disclosure_is_the_record_providers_answer(): void
    {
        $this->registerShareDomain(PamphletsDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $policy = $this->app->make(SharePolicy::class);

        $this->assertTrue($policy->mayDisclose(TestActors::record('pamphlets.pamphlet', 4)));
        $this->assertFalse($policy->mayDisclose(TestActors::record('pamphlets.note', 4)));
    }

    private function configuration(): ShareGatewayConfiguration
    {
        return ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
    }
}
