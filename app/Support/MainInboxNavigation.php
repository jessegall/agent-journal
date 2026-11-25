<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Inboxes\MainInbox;
use App\Models\Agents\Agent;
use App\Models\Drivers\NavigationRequest;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Records\AssignmentRecord;
use PhpOption\Option;

/**
 * Main's side of navigation: the agent attached there, and the navigation requests main holds as Core's own
 * responsibility, which no public assignment changes.
 */
final readonly class MainInboxNavigation implements MainInbox
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
    ) {}

    public function occupant(): Option
    {
        return Option::fromValue(InboxMember::attachedTo([Inbox::main()->id], Agent::class)[0] ?? null);
    }

    public function receive(NavigationRequest $request): void
    {
        if ($this->store->lockCurrent($request->assignmentIdentity())->isDefined()) {
            return;
        }

        $this->responsibilities->assign($request->assignmentIdentity(), $this->main()->assigneeIdentity());
    }

    public function openRequestsFor(ActorIdentity $actor): int
    {
        if (! NavigationRequest::query()->acrossActors()->open()->exists()) {
            return 0;
        }

        $seated = $this->occupant()->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($actor));

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
        return Inbox::main();
    }
}
