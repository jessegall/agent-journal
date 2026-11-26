<?php

declare(strict_types=1);

namespace App\CommandRules;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\Work\ActorStackSessions;
use App\Support\ActorReference;
use App\Support\CommandRegistry;

/**
 * Finds whose request keys a write or a read belongs to: an agent's keys live in the session of its signed call, a
 * user's and the journal's in the actor alone.
 */
final readonly class ReceiptCallers
{
    public function __construct(
        private CurrentActor $actors,
        private ActorStackSessions $stackSessions,
        private CommandRegistry $registry,
    ) {}

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
    public function of(ActorReference $actor): ReceiptCaller
    {
        $sessions = $this->stackSessions->admittableSessions();

        if ($sessions === []) {
            return ReceiptCaller::withoutSession($actor);
        }

        return ReceiptCaller::inSession(
            $actor,
            $sessions[0],
        );
    }

    /**
     * The receipt identity a command keys its receipts under: the actor alone for a command that keeps its key for
     * the actor, otherwise the actor in its session.
     */
    public function forCommand(string $command, ActorReference $actor): ReceiptCaller
    {
        if ($this->registry->hasActorScopedReceipt($command)) {
            return ReceiptCaller::withoutSession($actor);
        }

        return $this->of($actor);
    }
}
