<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Commands\RetryShare\RetryShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Exceptions\ShareRetryRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareProposal;
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
use Tests\Support\TestProjects;

/**
 * A retry of a failed share adds one open request and keeps its deadline; a share that expired, was revoked or is
 * only proposed is refused.
 */
#[TestsCommand(RetryShareCommand::class)]
final class RetryShareTest extends TestCase
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

    public function test_a_retry_of_a_failed_share_adds_one_open_request_and_keeps_its_deadline(): void
    {
        $share = $this->share([]);
        $share->status = ShareStatus::Failed;
        $share->save();

        $summary = $this->runOwner(fn (string $key) => new RetryShareCommand($share->id, $key));

        $this->assertSame(ShareStatus::Pending, $summary->status);
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
            TestProjects::localOwner(),
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
