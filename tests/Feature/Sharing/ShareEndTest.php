<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\RequestKey;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ShareExpiry;
use App\Sharing\Support\ShareLinkResolver;
use App\Sharing\Support\ShareSummary;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A share ends once: the owner's revoke commits locally even with no gateway running and leaves a close request for
 * the endpoint, a second revoke writes nothing, a proposal is dismissed the same way, and ExpireShares ends at most
 * 100 overdue shares and proposals per run, auditing each once. The token cannot be read back after either.
 */
final class ShareEndTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use StartsAgentRequests;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
    }

    public function test_a_revoke_while_the_gateway_is_offline_commits_and_leaves_a_pending_close(): void
    {
        $share = $this->activeShare(CarbonImmutable::now()->addDay());
        $digest = $share->token_digest;

        $summary = $this->revoke($share, '01JD8X0G9M3QZ6V4K2REVOKE01');
        $revoked = Share::query()->findOrFail($share->id);

        $this->assertSame(ShareState::Revoked, $summary->state);
        $this->assertNull($revoked->token_ciphertext);
        $this->assertSame($digest, $revoked->token_digest);
        $this->assertNotNull($revoked->terminal_at);
        $close = ShareGatewayOperation::query()->readAll('one close')->sole();
        $this->assertSame([GatewayOperationType::Close, null], [$close->type, $close->run_id]);
        $this->assertTrue($this->app->make(ShareLinkResolver::class)->linkFor(TestActors::user(9), $share->id)->isEmpty());
        $this->assertSame([ShareAuditType::Revoked], $this->auditTypes());
    }

    public function test_a_second_revoke_writes_nothing(): void
    {
        $share = $this->activeShare(CarbonImmutable::now()->addDay());
        $first = $this->revoke($share, '01JD8X0G9M3QZ6V4K2REVOKE01');
        $endedAt = Share::query()->findOrFail($share->id)->terminal_at;

        $this->travel(5)->minutes();
        $second = $this->revoke($share, '01JD8X0G9M3QZ6V4K2REVOKE02');

        $this->assertEquals($first, $second);
        $this->assertEquals($endedAt, Share::query()->findOrFail($share->id)->terminal_at);
        $this->assertSame(1, ShareGatewayOperation::query()->count());
        $this->assertSame([ShareAuditType::Revoked], $this->auditTypes());
    }

    public function test_a_revoke_dismisses_a_proposal_without_a_close(): void
    {
        $proposal = Share::propose(TestActors::record('binders.binder', 1), TestActors::agentIdentity(5), CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS));

        $this->assertSame(ShareState::Revoked, $this->revoke($proposal, '01JD8X0G9M3QZ6V4K2REVOKE01')->state);
        $this->assertSame(0, ShareGatewayOperation::query()->count());
    }

    public function test_no_close_is_requested_while_another_live_share_uses_the_endpoint(): void
    {
        $share = $this->activeShare(CarbonImmutable::now()->addDay());
        $this->activeShare(CarbonImmutable::now()->addDay());

        $this->revoke($share, '01JD8X0G9M3QZ6V4K2REVOKE01');

        $this->assertSame(0, ShareGatewayOperation::query()->count());
    }

    public function test_expire_shares_run_twice_audits_each_expiry_once(): void
    {
        $overdue = $this->activeShare(CarbonImmutable::now()->subMinute());
        $proposal = Share::propose(TestActors::record('binders.binder', 2), TestActors::agentIdentity(5), CarbonImmutable::now()->subMinute());
        $current = $this->activeShare(CarbonImmutable::now()->addDay());

        $this->assertEquals(new ShareExpiry(2, false), $this->expire());
        $this->assertEquals(new ShareExpiry(0, false), $this->expire());

        $this->assertSame(ShareState::Expired, Share::query()->findOrFail($overdue->id)->state);
        $this->assertSame(ShareState::Expired, Share::query()->findOrFail($proposal->id)->state);
        $this->assertSame(ShareState::Active, Share::query()->findOrFail($current->id)->state);
        $this->assertNull(Share::query()->findOrFail($overdue->id)->token_ciphertext);
        $this->assertSame([ShareAuditType::Expired, ShareAuditType::Expired], $this->auditTypes());
    }

    #[TimeLimit(5, 'It creates over a hundred shares to reach the batch limit.')]
    public function test_expire_shares_takes_at_most_a_hundred_and_says_more_wait(): void
    {
        for ($index = 0; $index <= 100; $index++) {
            Share::propose(TestActors::record('binders.binder', 1000 + $index), TestActors::agentIdentity(5), CarbonImmutable::now()->subMinute());
        }

        $this->assertEquals(new ShareExpiry(100, true), $this->expire());
        $this->assertEquals(new ShareExpiry(1, false), $this->expire());
    }

    public function test_only_the_system_expires_shares(): void
    {
        $this->startTestUserRequest(9);

        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run(new ExpireShares()), CommandNotRegistered::class);
    }

    private function activeShare(CarbonImmutable $expiresAt): Share
    {
        $share = Share::grant(TestActors::record('binders.binder', 1), TestIds::of(9), $this->configuration, ShareToken::generate(), $expiresAt);
        $share->state = ShareState::Active;
        $share->save();

        return $share;
    }

    private function revoke(Share $share, string $key): ShareSummary
    {
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(9);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(new RevokeShare($share->id, $key));
    }

    private function expire(): ShareExpiry
    {
        $this->app->forgetScopedInstances();

        return $this->throughEntry(new ExpireShares());
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(ShareAudit::query()->orderBy('id')->readAll('a few audits')->get()->map(fn (ShareAudit $audit) => $audit->type)->all());
    }
}
