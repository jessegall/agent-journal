<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\ChildRole;
use App\Events\ChildCheckoutRequested;
use App\Models\AgentRuntime;
use App\Models\ChildClaim;
use App\Models\ProjectBinding;
use App\Models\WorkspaceRead;

/**
 * When a connected project's relay claims a child's start, issues the child's claim once, from the commit the
 * parent's latest version 2 read verified, and hands the relay the checkout its worktree is prepared for. A child of
 * a host that serves no binding, or whose parent has no verified commit yet, gets no checkout and works where its
 * start folder is, as before.
 */
final class IssueChildClaim implements Listener
{
    public function handle(ChildCheckoutRequested $request): void
    {
        foreach (ProjectBinding::liveIdOfLocalHost($request->hostId) as $bindingId) {
            foreach ($this->claimsOf($bindingId, $request) as $claim) {
                $request->slot->fill($claim->checkout);
            }
        }
    }

    /**
     * The child's claim: the one issued already, or a new one from the parent's verified commit; none without one.
     *
     * @return list<ChildClaim>
     */
    private function claimsOf(string $bindingId, ChildCheckoutRequested $request): array
    {
        $issued = ChildClaim::ofChildAgent($request->childAgentId);

        if ($issued !== []) {
            return $issued;
        }

        $parent = AgentRuntime::ofSession($request->parentSessionId);

        if ($parent === null) {
            return [];
        }

        $binding = ProjectBinding::query()->findOrFail($bindingId);

        return array_map(
            fn ($read) => ChildClaim::forMainRuntime($binding, $parent->id, $request->childAgentId, ChildRole::Writer, $read),
            WorkspaceRead::latestCommitReadOf($parent->session->agent_id),
        );
    }
}
