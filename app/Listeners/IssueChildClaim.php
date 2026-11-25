<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\Agents\ChildRole;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Agents\ChildClaim;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\WorkspaceRead;

/**
 * When a connected project's relay claims a child's start, issues the child's claim once, from the commit the
 * parent's latest commit read verified, nested under the parent's own claim when the parent is a child, and hands the
 * relay the checkout its worktree is prepared for. A child of a host that serves no binding, or whose parent has no
 * verified commit yet, gets no checkout and works where its start folder is.
 */
final class IssueChildClaim implements Listener
{
    public function handle(ChildCheckoutRequested $request): void
    {
        foreach (ProjectBinding::resolveLiveIdOfLocalHost($request->hostId) as $bindingId) {
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
        $issued = ChildClaim::findForChildAgent($request->childAgentId);

        if ($issued !== []) {
            return $issued;
        }

        $parent = AgentRuntime::findForSession($request->parentSessionId);

        if ($parent === null) {
            return [];
        }

        $binding = ProjectBinding::query()->findOrFail($bindingId);
        $parentAgentId = AgentSession::findById($request->parentSessionId)->agent_id;
        $parentClaims = ChildClaim::findForChildAgent($parentAgentId);

        return array_map(
            fn ($read) => $parentClaims === []
                ? ChildClaim::createForMainRuntime(
                    $binding,
                    $parent->id,
                    $request->childAgentId,
                    ChildRole::Writer,
                    $read,
                )
                : ChildClaim::createForParent($parentClaims[0], $request->childAgentId, ChildRole::Writer, $read),
            WorkspaceRead::resolveLatestCommitReadOf($parentAgentId),
        );
    }
}
