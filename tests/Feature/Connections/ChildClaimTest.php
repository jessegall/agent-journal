<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Values\CommitObservation;
use App\Agents\Values\WorkspaceFacts;
use App\Connections\Enums\ChildRole;
use App\Connections\Exceptions\ChildClaimRefused;
use App\Connections\Models\ChildClaim;
use App\Connections\Models\ProjectBinding;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A child claim starts from the commit a fresh version 2 read verified, records its ancestry, and refuses an unborn
 * root, a read with no commit and a base the parent's HEAD has moved from.
 */
final class ChildClaimTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'child_claims', 'connection_audits', 'project_invitations', 'project_bindings', 'projects',
        'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string HEAD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    public function test_a_claim_records_its_verified_base_and_ancestry(): void
    {
        $binding = $this->connected();
        $parent = (string) Str::ulid();
        $child = (string) Str::ulid();

        $claim = ChildClaim::forMainRuntime($binding, $parent, $child, ChildRole::Writer, $this->read($binding, true, 4));
        $grandchild = ChildClaim::nestedUnder($claim, (string) Str::ulid(), ChildRole::Reader, $this->read($binding, false, 5));

        $this->assertSame(
            [$parent, 4, $child, ChildRole::Writer, $binding->id, self::HEAD, true],
            [$claim->parent_runtime_id, $claim->parent_generation, $claim->child_agent_id, $claim->role,
                $claim->binding_id, $claim->base_oid, $claim->parent_was_dirty],
        );
        $this->assertSame([$claim->id, $parent], [$grandchild->parent_claim_id, $grandchild->root_runtime_id]);
        $this->assertNull($claim->parent_claim_id);
    }

    public function test_an_unborn_root_and_a_read_with_no_commit_are_refused(): void
    {
        $binding = $this->connected();
        $unborn = $this->readOf(CommitObservation::withoutCommit($binding->id, 'checkout-main', CommitObservation::UNBORN));

        $this->assertRefused(fn () => ChildClaim::forMainRuntime($binding, (string) Str::ulid(), (string) Str::ulid(), ChildRole::Writer, $unborn));
        $this->assertRefused(fn () => ChildClaim::forMainRuntime(
            $binding,
            (string) Str::ulid(),
            (string) Str::ulid(),
            ChildRole::Writer,
            $this->readOf(CommitObservation::notRecorded()),
        ));
        $this->assertSame(0, ChildClaim::query()->count());
    }

    public function test_a_base_the_head_moved_from_is_refused(): void
    {
        $binding = $this->connected();
        $claim = ChildClaim::forMainRuntime($binding, (string) Str::ulid(), (string) Str::ulid(), ChildRole::Writer, $this->read($binding, false, 1));

        $claim->assertHeadUnmoved(CommitObservation::ofHead($binding->id, 'checkout-main', self::HEAD));
        $this->expectException(ChildClaimRefused::class);
        $claim->assertHeadUnmoved(CommitObservation::ofHead($binding->id, 'checkout-main', str_repeat('b', 40)));
    }

    private function connected(): ProjectBinding
    {
        $this->issueLine('the-ticket');

        return ProjectBinding::query()->findOrFail(
            $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId'),
        );
    }

    private function read(ProjectBinding $binding, bool $isDirty, int $generation): WorkspaceFacts
    {
        return new WorkspaceFacts(
            true,
            $isDirty,
            ! $isDirty,
            $generation,
            CarbonImmutable::now(),
            CommitObservation::ofHead($binding->id, 'checkout-main', self::HEAD),
        );
    }

    private function readOf(CommitObservation $commit): WorkspaceFacts
    {
        return new WorkspaceFacts(true, false, true, 1, CarbonImmutable::now(), $commit);
    }

    private function assertRefused(callable $claim): void
    {
        try {
            $claim();
            $this->fail('the claim was issued');
        } catch (ChildClaimRefused) {
            $this->addToAssertionCount(1);
        }
    }
}
