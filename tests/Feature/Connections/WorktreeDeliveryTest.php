<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\ChildRole;
use App\Enums\DeliveryOutcome;
use App\Models\Agents\ChildClaim;
use App\Models\Projects\ProjectBinding;
use App\Models\Reviews\WorktreeDelivery;
use App\Values\CommitObservation;
use App\Values\WorkspaceFacts;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A child's relay submits its verified commit for integration once under its delivery id, only for its own
 * binding's claim, and the merger's result is kept apart from it.
 */
final class WorktreeDeliveryTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'worktree_deliveries', 'child_claims', 'connection_audits', 'project_invitations', 'install_attempts',
        'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records',
        'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    private const string OTHER_NONCE = 'nonce-bbbbbbbbbbbbbbbb';

    private const string BASE = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private const string TIP = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    public function test_a_delivery_is_recorded_once_for_its_own_claim_and_its_result_kept_apart(): void
    {
        $claim = $this->claimOf($this->connected('ticket-one', self::NONCE));
        $this->connected('ticket-two', self::OTHER_NONCE);

        $this->deliver(self::NONCE, $claim, self::TIP)
            ->assertOk()
            ->assertExactJson(['deliveryId' => 'delivery-1', 'tip' => self::TIP, 'outcome' => 'submitted']);
        $this->deliver(self::NONCE, $claim, self::TIP)->assertOk()->assertJsonPath('deliveryId', 'delivery-1');
        $this->deliver(self::NONCE, $claim, str_repeat('c', 40))->assertConflict();
        $this->deliver(self::OTHER_NONCE, $claim, self::TIP)->assertConflict();

        $delivery = WorktreeDelivery::query()->sole();
        $this->assertSame(self::BASE, $delivery->base_oid);
        $delivery->recordMerged(str_repeat('d', 40), true);
        $this->assertSame(DeliveryOutcome::Merged, $delivery->fresh()?->outcome);
        $this->assertTrue($delivery->fresh()?->tip_is_reachable);
        $delivery->recordConflict(str_repeat('e', 40), ['src/Shop.php']);
        $conflicted = WorktreeDelivery::query()->sole();
        $this->assertSame(['src/Shop.php'], $conflicted->conflict_paths);
        $this->assertSame([self::TIP, str_repeat('e', 40)], [$conflicted->delivered_tip, $conflicted->resulting_target_oid]);
    }

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        return ProjectBinding::query()->findOrFail($this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId'));
    }

    private function claimOf(ProjectBinding $binding): ChildClaim
    {
        $read = new WorkspaceFacts(
            true,
            false,
            true,
            1,
            CarbonImmutable::now(),
            CommitObservation::ofHead($binding->id, 'checkout-main', self::BASE),
        );

        return ChildClaim::forMainRuntime($binding, (string) Str::ulid(), (string) Str::ulid(), ChildRole::Writer, $read);
    }

    private function deliver(string $nonce, ChildClaim $claim, string $tip): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            '/host/deliveries',
            [
                'deliveryId' => 'delivery-1',
                'claim' => $claim->id,
                'generation' => 1,
                'checkout' => '/Users/owner/shop/.journal/worktrees/child',
                'tip' => $tip,
                'targetRef' => 'refs/heads/main',
                'expectedTarget' => self::BASE,
            ],
            (string) Str::uuid(),
        );
    }
}
