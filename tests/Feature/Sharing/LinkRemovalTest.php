<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Agents\Models\Agent;
use App\Bus\Contracts\UnitOwner;
use App\Links\Models\Link;
use App\Records\Support\LinkRemoval;
use App\Records\Support\RecordIdentity;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareGrant;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\ConnectionInterface;
use RuntimeException;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Removing a link ends the share approval that rested on it, in the same transaction: a rolled-back removal leaves
 * it approved, and linking the records again makes a new link that the share does not approve.
 */
final class LinkRemovalTest extends TestCase
{
    use RefreshHookDatabase;

    private Agent $source;

    private Agent $target;

    private ShareMember $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->source = Agent::create('Source', 'read-only-helper');
        $this->target = Agent::create('Target', 'read-only-helper');
        Link::connect($this->source, $this->target);
        $link = Link::query()->between($this->source, $this->target)->sole();
        $configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $share = Share::create(
            $this->identityOf($this->source),
            CarbonImmutable::now()->addDays(7),
            new ShareGrant(
                TestIds::of(9),
                $configuration->id,
                $configuration->configuration_version,
                ShareToken::generate(),
            ),
        );
        $this->member = ShareMember::create(
            $share,
            $this->identityOf($this->source),
            new ShareSelectedTarget($this->identityOf($this->target), $link->id, '1'),
        );
    }

    public function test_removing_the_link_ends_its_approval_in_the_same_transaction(): void
    {
        $this->inCommandUnit(function (): void {
            $this->app->make(LinkRemoval::class)->removeBetween($this->source, $this->target);

            $this->assertNotNull($this->member->fresh()?->invalidated_at);
        });

        $this->assertNotNull($this->member->fresh()?->invalidated_at);
    }

    public function test_a_rolled_back_removal_leaves_the_approval(): void
    {
        $this->assertThrows(fn () => $this->inCommandUnit(function (): void {
            $this->app->make(LinkRemoval::class)->removeBetween($this->source, $this->target);

            throw SimulatedFailure::of('rolled back');
        }), RuntimeException::class);

        $this->assertNull($this->member->fresh()?->invalidated_at);
    }

    public function test_linking_again_does_not_restore_the_approval(): void
    {
        $this->inCommandUnit(
            fn () => $this->app->make(LinkRemoval::class)->removeBetween($this->source, $this->target),
        );
        Link::connect($this->source, $this->target);
        $share = Share::query()->findOrFail($this->member->share_id);

        $this->assertNotNull($this->member->fresh()?->invalidated_at);
        $this->assertSame([], ShareMember::approvedLinkIdsOf($share));
    }

    public function test_a_candidate_whose_link_is_not_approved_is_not_shared_yet(): void
    {
        $share = Share::query()->findOrFail($this->member->share_id);
        $approved = new ShareLinkedCandidate(
            new ShareRecordCard($this->identityOf($this->target), 'Target', '1'),
            $this->identityOf($this->source),
            $this->member->link_id,
        );
        $other = new ShareLinkedCandidate(
            new ShareRecordCard(TestActors::record('core.agent', 3), 'Other', '1'),
            $this->identityOf($this->source),
            TestIds::of(4),
        );
        $candidates = new ShareCandidates(
            new ShareRecordCard($this->identityOf($this->source), 'Source', '1'),
            [$approved, $other],
        );

        $this->assertSame([$other], $candidates->notSharedYet(ShareMember::approvedLinkIdsOf($share)));
    }

    private function identityOf(Agent $agent): RecordIdentity
    {
        return new RecordIdentity($agent->getMorphClass(), $agent->id);
    }

    /**
     * Runs the work in a transaction of its own that owns an event unit, as a command's transaction does: it commits
     * when the work returns and rolls back when it throws.
     *
     * @param  Closure(): mixed  $work
     */
    private function inCommandUnit(Closure $work): mixed
    {
        $connection = $this->app->make(ConnectionInterface::class);
        $connection->beginTransaction();

        return $this->app->make(UnitOwner::class)->own(
            $connection,
            'the test',
            $work,
            fn () => $connection->commit(),
            fn () => $connection->rollBack(),
        );
    }
}
