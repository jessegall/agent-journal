<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Links\Models\Link;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Exceptions\ShareRefreshRefused;
use App\Sharing\Exceptions\ShareRetryRefused;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareSummary;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner replaces a live share's members from a fresh preview of its own root at the next scope version, keeping
 * its token and deadline; and retries opening a pending or failed share before its deadline, which adds one open
 * request. Other shares are refused by name.
 */
final class ShareRefreshAndRetryTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;
    use StartsAgentRequests;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private int $keys = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([101, 102] as $number) {
            Link::recorded($this->root->type, $this->root->id, 'binders.sheet', TestIds::of($number));
        }
    }

    public function test_a_refresh_replaces_the_members_at_the_next_scope_version_and_keeps_token_and_deadline(): void
    {
        $share = $this->share([TestIds::of(101)]);
        $saved = $this->preview($this->root, [TestIds::of(102)]);

        $summary = $this->runOwner(
            fn (string $key) => new RefreshShareScope($share->id, $saved->previewId, $saved->checksum, $key),
        );
        $refreshed = Share::query()->findOrFail($share->id);

        $this->assertSame($share->id, $summary->shareId);
        $this->assertSame(Share::FIRST_SCOPE_VERSION + 1, $refreshed->scope_version);
        $this->assertSame(
            [[TestIds::of(102), Share::FIRST_SCOPE_VERSION + 1]],
            ShareMember::query()->readAll('one member')->get()->map(
                fn (ShareMember $member) => [$member->target_id, $member->scope_version],
            )->all(),
        );
        $this->assertSame($share->token_digest, $refreshed->token_digest);
        $this->assertSame($share->token_ciphertext, $refreshed->token_ciphertext);
        $this->assertEquals($share->expires_at, $refreshed->expires_at);
        $this->assertTrue(
            ShareAudit::query()->readAll('two audits')->get()->contains(
                fn (ShareAudit $audit) => $audit->type === ShareAuditType::ScopeRefreshed,
            ),
        );
    }

    public function test_a_refresh_from_a_preview_of_another_root_is_refused(): void
    {
        $share = $this->share([TestIds::of(101)]);
        $saved = $this->preview(TestActors::record('binders.binder', 2), []);

        $this->assertThrows(
            fn () => $this->runOwner(
                fn (string $key) => new RefreshShareScope($share->id, $saved->previewId, $saved->checksum, $key),
            ),
            ShareRefreshRefused::class,
            'another record',
        );
        $this->assertSame(Share::FIRST_SCOPE_VERSION, Share::query()->findOrFail($share->id)->scope_version);
    }

    public function test_a_retry_of_a_failed_share_adds_one_open_request_and_keeps_its_deadline(): void
    {
        $share = $this->share([]);
        $share->state = ShareState::Failed;
        $share->save();

        $summary = $this->runOwner(fn (string $key) => new RetryShare($share->id, $key));

        $this->assertSame(ShareState::Pending, $summary->state);
        $this->assertSame(2, ShareGatewayOperation::query()->where('type', GatewayOperationType::Open->value)->count());
        $this->assertEquals($share->expires_at, Share::query()->findOrFail($share->id)->expires_at);
        $this->assertTrue(
            ShareAudit::query()->readAll('two audits')->get()->contains(
                fn (ShareAudit $audit) => $audit->type === ShareAuditType::Retried,
            ),
        );
    }

    public function test_a_retry_of_an_expired_a_revoked_or_a_proposed_share_is_refused(): void
    {
        $expired = $this->share([]);
        $this->travel(ShareDuration::STANDARD_MINUTES + 1)->minutes();
        $revoked = $this->share([]);
        $revoked->state = ShareState::Revoked;
        $revoked->save();
        $proposal = Share::propose(
            $this->root,
            TestActors::agentIdentity(5),
            CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
        );

        foreach ([$expired, $revoked, $proposal] as $share) {
            $this->assertThrows(
                fn () => $this->runOwner(fn (string $key) => new RetryShare($share->id, $key)),
                ShareRetryRefused::class,
            );
        }

        $this->assertSame(2, ShareGatewayOperation::query()->count());
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function share(array $selectedIds): Share
    {
        $saved = $this->preview($this->root, $selectedIds);
        $summary = $this->runOwner(
            fn (string $key) => new CreateShare(
                $saved->previewId,
                $saved->checksum,
                ShareDuration::STANDARD_MINUTES,
                $key,
            ),
        );

        return Share::query()->findOrFail($summary->shareId);
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function preview(RecordIdentity $root, array $selectedIds): SavedSharePreview
    {
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(9);

        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreview($root->type, $root->id, $selectedIds, $this->configuration->id),
        );
    }

    /**
     * Runs an owner command under a new request key.
     *
     * @param  callable(string): (CreateShare|RefreshShareScope|RetryShare)  $command
     */
    private function runOwner(callable $command): ShareSummary
    {
        $key = sprintf('01JD8X0G9M3QZ6V4K2KEY%05d', ++$this->keys);
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(9);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run($command($key));
    }
}
