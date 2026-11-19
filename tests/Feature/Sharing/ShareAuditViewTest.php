<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\ShareAuditActor;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ShareAuditResolver;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The owner reads a share's audit apart from its life: public reads show an unknown visitor and are told apart from
 * lifecycle rows, a page at a time with what pruning kept; and the runtime panel says Offline without a sharing
 * service, and turns stale 45 seconds after the endpoint's last healthy report.
 */
final class ShareAuditViewTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private User $owner;

    private Share $share;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $this->share = Share::grant(
            TestActors::record('binders.binder', 1),
            $this->owner->id,
            $this->configuration,
            ShareToken::generate(),
            CarbonImmutable::now()->addDay(),
        );
        ShareAudit::recordFor(
            $this->share,
            ShareAuditType::Created,
            new ActorIdentity(ActorType::User, $this->owner->id),
            null,
        );
        ShareAudit::recordFor($this->share, ShareAuditType::ReadAllowed, ActorIdentity::system(), null);
        ShareAudit::recordFor($this->share, ShareAuditType::ReadDenied, ActorIdentity::system(), 'rate_limited');
    }

    public function test_reads_show_an_unknown_visitor_apart_from_the_lifecycle(): void
    {
        $this->actingAs($this->owner)->get(
            "/sharing/shares/{$this->share->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
                    ->has('page.data.audit.entries', 3)
                    ->where('page.data.audit.entries.0.type', 'read_denied')
                    ->where('page.data.audit.entries.0.actor', 'visitor')
                    ->where('page.data.audit.entries.0.isRead', true)
                    ->where('page.data.audit.entries.0.reasonCode', 'rate_limited')
                    ->where('page.data.audit.entries.2.type', 'created')
                    ->where('page.data.audit.entries.2.actor', 'owner')
                    ->where('page.data.audit.entries.2.isRead', false)
                    ->where('page.data.audit.nextAfter', null));
    }

    public function test_the_audit_pages_on_and_carries_the_pruned_totals(): void
    {
        for ($index = 0; $index < 50; $index++) {
            ShareAudit::recordFor($this->share, ShareAuditType::ReadAllowed, ActorIdentity::system(), null);
        }

        $this->share->pruned_allowed_reads = 7;
        $this->share->last_pruned_at = CarbonImmutable::now();
        $this->share->save();
        $resolver = $this->app->make(ShareAuditResolver::class);
        $first = $resolver->page(Share::query()->findOrFail($this->share->id), null);
        $second = $resolver->page(Share::query()->findOrFail($this->share->id), $first->nextAfter);

        $this->assertCount(50, $first->entries);
        $this->assertNotNull($first->nextAfter);
        $this->assertCount(3, $second->entries);
        $this->assertSame(ShareAuditActor::Owner, $second->entries[2]->actor);
        $this->assertSame(7, $first->prunedAllowedReads);
        $this->assertNotNull($first->lastPrunedAt);
    }

    public function test_the_runtime_panel_is_offline_without_a_service_and_stale_45_seconds_after_health(): void
    {
        $this->actingAs($this->owner)->get(
            "/sharing/shares/{$this->share->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
                    ->where('page.data.runtime.isOffline', true)
                    ->where('page.data.runtime.endpointVersion', null));

        ShareInstallation::lockForAdmission()->holdFor(self::RUN);
        $endpoint = ShareGatewayEndpoint::openFor($this->configuration, 1, self::RUN);
        $endpoint->moveTo(GatewayEndpointState::Open);
        $endpoint->recordHealthy();

        $this->actingAs($this->owner)->get(
            "/sharing/shares/{$this->share->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
                    ->where('page.data.runtime.isOffline', false)
                    ->where('page.data.runtime.endpointVersion', 1)
                    ->where('page.data.runtime.isHealthy', true));

        $this->travel(46)->seconds();

        $this->actingAs($this->owner)->get(
            "/sharing/shares/{$this->share->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
                    ->where('page.data.runtime.isHealthy', false));
    }
}
