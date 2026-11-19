<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\WorkStacks;
use App\Actors\Support\ActorContext;

/**
 * Finds whose request keys a write or a read belongs to: an agent's keys live in the session of its signed call, a
 * user's and the journal's in the actor alone.
 */
final readonly class ReceiptCallers
{
    public function __construct(private CurrentActor $actors, private WorkStacks $workStacks) {}

    /**
     * The caller of this request.
     */
    public function current(): ReceiptCaller
    {
        return $this->of($this->actors->actor());
    }

    /**
     * The receipt identity of the actor: the session of its signed call when its type works on one, as the same
     * provider that names the stack to admit says, otherwise the actor alone.
     */
    public function of(ActorContext $actor): ReceiptCaller
    {
        $sessions = $this->workStacks->sessionsToAdmit();

        return $sessions === [] ? ReceiptCaller::withoutSession($actor) : ReceiptCaller::inSession($actor, $sessions[0]);
    }
}
