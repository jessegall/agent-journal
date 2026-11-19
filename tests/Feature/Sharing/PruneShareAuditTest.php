<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\SystemActor;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Support\AuditPruning;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Pruning the share audit: public reads go after 30 days and the steps of a share's life 365 days after it ended,
 * each counted on its share with the time of pruning and one AuditPruned fact; recent rows and live shares' steps
 * stay; a second run with nothing to prune writes nothing.
 */
final class PruneShareAuditTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_rows_past_retention_go_counted_on_their_share_and_a_second_run_writes_nothing(): void
    {
        $configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $live = Share::grant(new RecordIdentity('binders.binder', TestIds::of(1)), TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
        $ended = Share::grant(new RecordIdentity('binders.binder', TestIds::of(2)), TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());

        $this->travelTo(CarbonImmutable::now()->subDays(400));
        $this->audit($ended, ShareAuditType::Created);
        $ended->end(ShareState::Revoked);
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
        ShareAudit::recordFor($share, $type, $type->isRead() ? ActorIdentity::system() : new ActorIdentity(ActorType::User, TestIds::of(9)), null);
    }

    private function prune(): AuditPruning
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new SystemActor()), new TrustedEntryAuthority('test'));

        return $this->app->make(CommandBus::class)->run(new PruneShareAudit());
    }

    /**
     * @return array{int, int, int}
     */
    private function totalsOf(Share $share): array
    {
        $fresh = Share::query()->findOrFail($share->id);

        return [$fresh->pruned_allowed_reads, $fresh->pruned_denied_reads, $fresh->pruned_lifecycle_rows];
    }
}
