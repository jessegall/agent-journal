<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Enums\GatewayOperationType;
use App\Enums\ShareState;
use App\Exceptions\GatewayRunStale;
use App\Exceptions\SupervisorInsideTransaction;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Support\RecordIdentity;
use App\Support\ShareGatewayRegistry;
use App\Support\ShareLinkResolver;
use App\Support\ShareProposal;
use App\Support\SharingSupervisor;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The sharing supervisor with the test double gateway: a run activates a pending share by claiming, opening outside
 * every transaction and recording; an older run can record nothing once a newer one took over; a restart opens the
 * live shares again under the same link and token and records a healthy probe; proposals and ended shares never open.
 */
#[TimeLimit(seconds: 10, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingSupervisorTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
        'number_groups',
    ];

    private FakeShareGateway $gateway;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->gateway = new FakeShareGateway();
        $this->app->instance(FakeShareGateway::class, $this->gateway);
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
    }

    public function test_a_run_activates_a_pending_share(): void
    {
        $share = $this->pendingShare(1);
        $supervisor = $this->supervisor();

        $supervisor->begin();

        $this->assertTrue($supervisor->work());
        $this->assertFalse($supervisor->work());
        $this->assertSame(ShareState::Active, Share::query()->findOrFail($share->id)->state);
        $this->assertCount(1, $this->gateway->opened);
    }

    public function test_an_older_run_records_nothing_once_a_newer_one_took_over(): void
    {
        $share = $this->pendingShare(1);
        $older = $this->supervisor();
        $newer = $this->supervisor();

        $older->begin();
        $newer->begin();

        $this->assertThrows(fn () => $older->work(), GatewayRunStale::class);
        $this->assertSame(ShareState::Pending, Share::query()->findOrFail($share->id)->state);
        $this->assertTrue($newer->work());
        $this->assertSame(ShareState::Active, Share::query()->findOrFail($share->id)->state);
    }

    public function test_a_restart_reopens_active_shares_with_the_same_link_and_token_after_a_healthy_probe(): void
    {
        $share = $this->pendingShare(1);
        $first = $this->supervisor();
        $first->begin();
        $first->work();
        $digest = Share::query()->findOrFail($share->id)->token_digest;
        $link = $this->app->make(ShareLinkResolver::class)->linkFor(TestActors::user(9), $share->id)->get();

        $restarted = $this->supervisor();

        $this->assertSame(1, $restarted->begin());
        $this->assertTrue($restarted->work());
        $restarted->checkHealth();

        $this->assertSame(ShareState::Active, Share::query()->findOrFail($share->id)->state);
        $this->assertSame($digest, Share::query()->findOrFail($share->id)->token_digest);
        $this->assertSame(
            $link,
            $this->app->make(ShareLinkResolver::class)->linkFor(TestActors::user(9), $share->id)->get(),
        );
        $this->assertCount(2, $this->gateway->opened);
        $reopened = ShareGatewayEndpoint::query()->where('run_id', $restarted->runId)->sole();
        $this->assertSame(2, $reopened->endpoint_version);
        $this->assertTrue($reopened->isHealthy());
    }

    public function test_proposals_and_ended_shares_never_open_a_tunnel(): void
    {
        Share::create(
            TestActors::record('binders.binder', 1),
            CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
            new ShareProposal(TestActors::agentIdentity(5)),
        );
        $revoked = TestShares::grantForADay(TestActors::record('binders.binder', 2), $this->configuration);
        $revoked->end(ShareState::Revoked);

        $this->assertSame(0, $this->supervisor()->begin());
        $this->assertSame(0, ShareGatewayOperation::query()->count());
    }

    public function test_a_gateway_program_is_never_run_inside_a_transaction(): void
    {
        $this->pendingShare(1);
        $supervisor = $this->supervisor();
        $supervisor->begin();
        DB::beginTransaction();

        try {
            $this->assertThrows(fn () => $supervisor->work(), SupervisorInsideTransaction::class);
        } finally {
            DB::rollBack();
        }

        $this->assertSame([], $this->gateway->opened);
    }

    private function pendingShare(int $rootIdNumber): Share
    {
        $rootId = TestIds::of($rootIdNumber);
        $share = TestShares::grantForADay(new RecordIdentity('binders.binder', $rootId), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);

        return $share;
    }

    private function supervisor(): SharingSupervisor
    {
        return $this->app->make(SharingSupervisor::class);
    }
}
