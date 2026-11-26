<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Commands\PruneShareAudit\PruneShareAuditCommand;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\AuditPruning;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * Pruning the share audit: public reads go after 30 days and the steps of a share's life 365 days after it ended,
 * each counted on its share with the time of pruning and one AuditPruned fact; recent rows and live shares' steps
 * stay; a second run with nothing to prune writes nothing.
 */
#[TestsCommand(PruneShareAuditCommand::class)]
final class PruneShareAuditTest extends SharingTestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_rows_past_retention_go_counted_on_their_share_and_a_second_run_writes_nothing(): void
    {
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $live = $this->grantForADay(TestActors::record('binders.binder', 1), $configuration);
        $ended = $this->grantForADay(TestActors::record('binders.binder', 2), $configuration);

        $this->travelTo(CarbonImmutable::now()->subDays(400));
        $this->audit($ended, ShareAuditType::Created);
        $ended->end(ShareStatus::Revoked);
        $this->audit($ended, ShareAuditType::Revoked);
        $this->audit($live, ShareAuditType::Created);
        $this->travelBack();
        $this->travelTo(CarbonImmutable::now()->subDays(31));
        $this->audit($live, ShareAuditType::ReadAllowed);
        $this->audit($live, ShareAuditType::ReadDenied);
        $this->travelBack();
        $this->audit($live, ShareAuditType::ReadAllowed);

        $this->assertEquals(new AuditPruning(4, false), $this->prune());

        $this->assertSame([[1, 1, 0], [0, 0, 2]], [$this->totalsOf($live), $this->totalsOf($ended)]);

        $this->assertNotNull($live->fresh()?->last_pruned_at);
        $this->assertSame(1, ShareAudit::query()->where('type', ShareAuditType::AuditPruned->value)->count());
        $this->assertSame(2, ShareAudit::query()->whereNotNull('share_id')->count());

        $this->assertEquals(new AuditPruning(0, false), $this->prune());
        $this->assertSame(1, ShareAudit::query()->where('type', ShareAuditType::AuditPruned->value)->count());

        $this->assertSame([1, 1, 0], $this->totalsOf($live));
    }

    private function audit(Share $share, ShareAuditType $type): void
    {
        ShareAudit::create(
            $share,
            $type,
            $type->isRead() ? ActorReference::system() : TestActors::userIdentity(9),
            null,
        );
    }

    private function prune(): AuditPruning
    {
        return $this->journal->asSystem(new PruneShareAuditCommand());
    }

    /**
     * @return array{int, int, int}
     */
    private function totalsOf(Share $share): array
    {
        $fresh = Share::query()->findOrFail($share->id);

        return [
            $fresh->pruned_allowed_reads,
            $fresh->pruned_denied_reads,
            $fresh->pruned_lifecycle_rows,
        ];
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
