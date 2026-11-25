<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\MainInboxTakeover;
use App\Contracts\Time\ServerClock;
use App\Enums\Assignments\ActorType;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * The main start's handover: the starting agent is attached to main, and a different agent attached there leaves and
 * is fenced, so its runtimes and credentials stop; the same agent restarting stays. An ordinary runtime start never
 * comes here.
 */
final readonly class MainInboxHandover implements MainInboxTakeover
{
    public function __construct(private ServerClock $clock) {}

    public function takeOver(Agent $agent): void
    {
        $main = Inbox::lockedById(Inbox::main()->id);
        $starter = ActorIdentity::of($agent);
        $now = $this->clock->now();

        foreach (InboxMember::attachedTo([$main->id], ActorType::Agent) as $previous) {
            if (! $previous->isSameAs($starter)) {
                InboxMember::leave($main->id, $previous, $now);
                Agent::withId($previous->id)->forAll(fn (Agent $fenced) => $fenced->fenceRuntimes());
            }
        }

        InboxMember::join($main->id, $starter, $now);
    }
}
