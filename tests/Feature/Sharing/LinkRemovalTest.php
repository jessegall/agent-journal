<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Agents\Models\Agent;
use App\Links\Models\Link;
use App\Records\Support\RecordIdentity;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
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

        $this->source = Agent::named('Source', 'read-only-helper');
        $this->target = Agent::named('Target', 'read-only-helper');
        $this->source->linkTo($this->target);
        $link = Link::query()->between($this->source, $this->target)->sole();
        $configuration = ShareGatewayConfiguration::configure(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $share = Share::grant(
            $this->identityOf($this->source),
            TestIds::of(9),
            $configuration,
            ShareToken::generate(),
            CarbonImmutable::now()->addDays(7),
        );
        $this->member = ShareMember::approve(
            $share,
            $this->identityOf($this->source),
            new ShareSelectedTarget($this->identityOf($this->target), $link->id, '1'),
        );
    }

    public function test_removing_the_link_ends_its_approval_in_the_same_transaction(): void
    {
        DB::transaction(function (): void {
            $this->source->unlinkFrom($this->target);

            $this->assertNotNull($this->member->fresh()?->invalidated_at);
        });

        $this->assertNotNull($this->member->fresh()?->invalidated_at);
    }

    public function test_a_rolled_back_removal_leaves_the_approval(): void
    {
        $this->assertThrows(fn () => DB::transaction(function (): void {
            $this->source->unlinkFrom($this->target);

            throw SimulatedFailure::of('rolled back');
        }), RuntimeException::class);

        $this->assertNull($this->member->fresh()?->invalidated_at);
    }

    public function test_linking_again_does_not_restore_the_approval(): void
    {
        $this->source->unlinkFrom($this->target);
        $this->source->linkTo($this->target);
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
}
