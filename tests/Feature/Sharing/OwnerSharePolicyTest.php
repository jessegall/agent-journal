<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Domains\Support\Domain;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Domains\Pamphlets\PamphletsDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner's share policy: only the current configured owner manages shares, an owner change ends every earlier
 * grant while the new owner still manages the old shares, and disclosure is the record provider's answer.
 */
final class OwnerSharePolicyTest extends TestCase
{
    use RefreshHookDatabase;

    private string $ownerId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->ownerId = TestIds::of(1);
        $this->app->instance(JournalAccessPolicy::class, new class($this) implements JournalAccessPolicy
        {
            public function __construct(private readonly OwnerSharePolicyTest $test) {}

            public function allows(Actor $actor): bool
            {
                return $actor->actorType() === ActorType::User && in_array($actor->actorId(), $this->allowedUserIds(), true);
            }

            public function allowedUserIds(): array
            {
                return [$this->test->ownerId()];
            }
        });
    }

    public function ownerId(): string
    {
        return $this->ownerId;
    }

    public function test_only_the_configured_owner_manages_shares(): void
    {
        $policy = $this->app->make(SharePolicy::class);

        $this->assertTrue($policy->mayManage(ActorContext::forUser($this->ownerId)));
        $this->assertFalse($policy->mayManage(ActorContext::forUser(TestIds::of(2))));
        $this->assertFalse($policy->mayManage(ActorContext::forAgent($this->ownerId)));
        $this->assertThrows(fn () => $policy->requireManager(ActorContext::forUser(TestIds::of(2))), SharingNotAllowed::class);
        $this->assertThrows(fn () => $policy->requireManager(ActorContext::forAgent(TestIds::of(3))), SharingNotAllowed::class);
    }

    public function test_an_owner_change_ends_earlier_grants_and_the_new_owner_still_manages(): void
    {
        $policy = $this->app->make(OwnerSharePolicy::class);
        $share = Share::grant(new RecordIdentity('pamphlets.pamphlet', TestIds::of(4)), $this->ownerId, $this->configuration(), ShareToken::generate(), CarbonImmutable::now()->addDays(7));
        $proposal = Share::propose(new RecordIdentity('pamphlets.pamphlet', TestIds::of(4)), new ActorIdentity(ActorType::Agent, TestIds::of(5)), CarbonImmutable::now()->addDays(7));

        $this->assertTrue($policy->grantHolds($share));
        $this->assertFalse($policy->grantHolds($proposal));

        $this->ownerId = TestIds::of(2);

        $this->assertFalse($policy->grantHolds($share));
        $this->assertTrue($policy->mayManage(ActorContext::forUser(TestIds::of(2))));
        $this->assertFalse($policy->mayManage(ActorContext::forUser(TestIds::of(1))));
    }

    public function test_disclosure_is_the_record_providers_answer(): void
    {
        $this->registerShareDomain(new PamphletsDomain());
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $policy = $this->app->make(SharePolicy::class);

        $this->assertTrue($policy->mayDisclose(new RecordIdentity('pamphlets.pamphlet', TestIds::of(4))));
        $this->assertFalse($policy->mayDisclose(new RecordIdentity('pamphlets.note', TestIds::of(4))));
    }

    private function configuration(): ShareGatewayConfiguration
    {
        return ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
    }

    /**
     * Registers a fixture domain's share records and gateways as the sharing provider does at boot.
     */
    private function registerShareDomain(Domain $domain): void
    {
        if ($domain instanceof ProvidesShareRecords) {
            $this->app->make(ShareRecordRegistry::class)->registerFrom($domain);
        }

        if ($domain instanceof ProvidesShareGateways) {
            $this->app->make(ShareGatewayRegistry::class)->registerFrom($domain);
        }
    }
}
