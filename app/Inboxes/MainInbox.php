<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Inboxes\Contracts\MainInbox as MainInboxContract;
use App\Models\Agents\Agent;
use App\Models\Drivers\NavigationRequest;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorReference;
use PhpOption\Option;

/**
 * Main's side of navigation: the agent attached there, and the navigation requests main holds as Core's own
 * responsibility, which no public assignment changes.
 */
final readonly class MainInbox implements MainInboxContract
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
    ) {}

    public function occupant(): Option
    {
        return Option::fromValue(InboxMember::resolveAttachedTo([Inbox::findMain()->id], Agent::class)[0] ?? null);
    }

    public function receive(NavigationRequest $request): void
    {
        if ($this->store->lockCurrent($request->assignmentIdentity())->isDefined()) {
            return;
        }

        $this->responsibilities->assign($request->assignmentIdentity(), $this->main()->assigneeIdentity());
    }

    public function openRequestsFor(ActorReference $actor): int
    {
        if (! NavigationRequest::query()->acrossActors()->open()->exists()) {
            return 0;
        }

        $seated = $this->occupant()->map(fn (ActorReference $occupant) => $occupant->isSameAs($actor));

        if (! $seated->getOrElse(false)) {
            return 0;
        }

        $held = AssignmentRecord::query()->heldRecordIds(
            NavigationRequest::linkType(),
            $this->main()->assigneeIdentity(),
        );

        return NavigationRequest::query()->acrossActors()->open()->withAnyId($held)->count();
    }

    private function main(): Inbox
    {
        return Inbox::findMain();
    }
}
