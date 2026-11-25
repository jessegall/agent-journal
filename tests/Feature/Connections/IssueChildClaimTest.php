<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\Agents\ChildRole;
use App\Enums\Projects\ArrangementType;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Listeners\IssueChildClaim;
use App\Models\Agents\Agent;
use App\Models\Agents\ChildClaim;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\WorkspaceRead;
use App\Support\ChildCheckoutSlot;
use App\Values\BindingFolder;
use App\Values\CommitObservation;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A relay claiming a child's start gets the child's claim from its parent's latest commit read: a child of a main
 * runtime starts a chain, and a child of a child nests its claim under its parent's own, naming the chain's root.
 */
final class IssueChildClaimTest extends TestCase
{
    use CommittedHookStack;

    private const string HEAD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    public function test_a_child_of_a_main_runtime_starts_a_chain_and_a_child_of_a_child_nests_under_it(): void
    {
        $binding = $this->localBinding();
        $this->readCommitOf($binding, 'read-1');
        $child = (string) Str::ulid();

        $this->requestCheckout($binding, $child);
        $childClaim = ChildClaim::query()->where('child_agent_id', $child)->sole();

        $this->assertNull($childClaim->parent_claim_id);

        // The parent agent becomes a child itself, so the next child it starts is a grandchild of the chain.
        $parentClaim = ChildClaim::createForParent($childClaim, $this->target->agentId, ChildRole::Writer, $this->facts($binding));
        $grandchild = (string) Str::ulid();
        $this->requestCheckout($binding, $grandchild);
        $grandchildClaim = ChildClaim::query()->where('child_agent_id', $grandchild)->sole();

        $this->assertSame(
            [$parentClaim->id, $parentClaim->root_runtime_id],
            [$grandchildClaim->parent_claim_id, $grandchildClaim->root_runtime_id],
        );
    }

    private function requestCheckout(ProjectBinding $binding, string $childAgentId): void
    {
        $this->app->make(IssueChildClaim::class)->handle(new ChildCheckoutRequested(
            $binding->host_id,
            $this->target->sessionId,
            $childAgentId,
            new ChildCheckoutSlot(),
        ));
    }

    private function localBinding(): ProjectBinding
    {
        $project = Project::create('shop', 'Shop');
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);

        return ProjectBinding::create(
            $host,
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent', $project),
            new BindingFolder('root-'.bin2hex(random_bytes(4)), '/Users/owner/shop', 'Owner laptop', bin2hex(random_bytes(8))),
        );
    }

    private function readCommitOf(ProjectBinding $binding, string $reference): void
    {
        WorkspaceRead::create(
            new WorkspaceReadReference($reference),
            TestActors::agentIdentity(1),
            WorkReference::free('chain-1'),
        )->answer($this->facts($binding));
    }

    private function facts(ProjectBinding $binding): WorkspaceFacts
    {
        return new WorkspaceFacts(
            true,
            false,
            true,
            1,
            CarbonImmutable::now(),
            CommitObservation::ofHead($binding->id, 'checkout-main', self::HEAD),
        );
    }
}
