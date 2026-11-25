<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Models\Records\Link;
use App\Support\Access\AccessSettings;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Commands\RetryShare\RetryShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Exceptions\ShareRefreshRefused;
use Domain\Sharing\Exceptions\ShareRetryRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareProposal;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\TestCase;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

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
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([
            101,
            102,
        ] as $number) {
            Link::create($this->root->type, $this->root->id, 'binders.sheet', TestIds::of($number));
        }
    }

    public function test_a_refresh_replaces_the_members_at_the_next_scope_version_and_keeps_token_and_deadline(): void
    {
        $share = $this->share([TestIds::of(101)]);
        $saved = $this->preview($this->root, [TestIds::of(102)]);

        $summary = $this->runOwner(
            fn (string $key) => new RefreshShareScopeCommand($share->id, $saved->previewId, $saved->checksum, $key),
        );
        $refreshed = Share::query()->findOrFail($share->id);

        $this->assertSame($share->id, $summary->shareId);
        $this->assertSame(Share::FIRST_SCOPE_VERSION + 1, $refreshed->scope_version);
        $this->assertSame(
            [[
                TestIds::of(102),
                Share::FIRST_SCOPE_VERSION + 1,
            ]],
            ShareMember::query()->readAll('one member')->get()->map(
                fn (ShareMember $member) => [
                    $member->target_id,
                    $member->scope_version,
                ],
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
                fn (string $key) => new RefreshShareScopeCommand($share->id, $saved->previewId, $saved->checksum, $key),
            ),
            ShareRefreshRefused::class,
            ShareRefreshRefused::otherRoot($share->id)->getMessage(),
        );
        $this->assertSame(Share::FIRST_SCOPE_VERSION, Share::query()->findOrFail($share->id)->scope_version);
    }

    public function test_a_retry_of_a_failed_share_adds_one_open_request_and_keeps_its_deadline(): void
    {
        $share = $this->share([]);
        $share->status = ShareStatus::Failed;
        $share->save();

        $summary = $this->runOwner(fn (string $key) => new RetryShareCommand($share->id, $key));

        $this->assertSame(ShareStatus::Pending, $summary->state);
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
        $revoked->status = ShareStatus::Revoked;
        $revoked->save();
        $proposal = Share::create(
            $this->root,
            CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
            new ShareProposal(TestActors::agentIdentity(5)),
        );

        foreach ([
            $expired,
            $revoked,
            $proposal,
        ] as $share) {
            $this->assertThrows(
                fn () => $this->runOwner(fn (string $key) => new RetryShareCommand($share->id, $key)),
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
            fn (string $key) => new CreateShareCommand(
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
            new SaveSharePreviewCommand($root->type, $root->id, $selectedIds, $this->configuration->id),
        );
    }

    /**
     * Runs an owner command under a new request key.
     *
     * @param  callable(string): (CreateShareCommand|RefreshShareScopeCommand|RetryShareCommand)  $command
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
