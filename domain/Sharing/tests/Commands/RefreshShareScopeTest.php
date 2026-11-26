<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use App\Values\ProjectOwner;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Commands\RetryShare\RetryShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Exceptions\ShareRefreshRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareRecordRegistry;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\Support\RegistersShareDomains;
use Domain\Sharing\Tests\TestCase;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * A refresh replaces a share's members at the next scope version and keeps its token and deadline; a preview of
 * another root is refused.
 */
#[TestsCommand(RefreshShareScopeCommand::class)]
final class RefreshShareScopeTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private int $keys = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->journal->owner();
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([
            101,
            102,
        ] as $number) {
            Link::create(
                $this->root->type,
                $this->root->id,
                'binders.sheet',
                TestIds::of($number),
                ProjectOwner::global(),
            );
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
            [[TestIds::of(102), Share::FIRST_SCOPE_VERSION + 1]],
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
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

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
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run($command($key));
    }
}
