<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\MainInboxTakeover as MainInboxTakeoverContract;
use App\Contracts\Time\ServerClock;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * The main start's handover: the starting agent is attached to main, and a different agent attached there leaves and
 * is fenced, so its runtimes and credentials stop; the same agent restarting stays. An ordinary runtime start never
 * comes here.
 */
final readonly class MainInboxTakeover implements MainInboxTakeoverContract
{
    public function __construct(private ServerClock $clock) {}

    public function takeOver(Agent $agent): void
    {
        $main = Inbox::findLockedById(Inbox::findMain()->id);
        $starter = ActorReference::of($agent);
        $now = $this->clock->now();

        foreach (InboxMember::resolveAttachedTo([$main->id], Agent::class) as $previous) {
            if ($previous->isSameAs($starter)) {
                continue;
            }

            $member = InboxMember::findActive($main->id, $previous);

            if ($member !== null) {
                $member->leave($now);
            }

            Agent::findWithId($previous->id)->forAll(fn (Agent $fenced) => $fenced->fenceRuntimes());
        }

        InboxMember::create($main->id, $starter, $now);
    }
}
