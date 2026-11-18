<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CallerSession;

/**
 * Finds whose request keys a write or a read belongs to: an agent's keys live in the session of its signed call, a
 * user's and the journal's in the actor alone.
 */
final readonly class ReceiptCallers
{
    public function __construct(private CurrentActor $actors, private CallerSession $session) {}

    /**
     * The caller of this request.
     */
    public function current(): ReceiptCaller
    {
        return $this->of($this->actors->actor());
    }

    public function of(ActorContext $actor): ReceiptCaller
    {
        if ($actor->type !== ActorType::Agent) {
            return ReceiptCaller::withoutSession($actor);
        }

        return ReceiptCaller::inSession($actor, $this->session->sessionId());
    }
}
