<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Communication\Exceptions\MembershipEvidenceMismatch;

/**
 * One actor's membership of an inbox with the evidence that proves it: a desk seat or a chat interval.
 */
final readonly class InboxMembership
{
    public function __construct(public ActorIdentity $actor, public MembershipEvidence $evidence) {}

    public static function atDeskSeat(ActorIdentity $actor, AssignmentReference $seat): self
    {
        return new self($actor, new DeskSeatEvidence($seat));
    }

    public static function inInterval(ActorIdentity $actor, string $intervalId): self
    {
        return new self($actor, new ChatIntervalEvidence($intervalId));
    }

    /**
     * The seat assignment of a desk membership.
     *
     * @throws MembershipEvidenceMismatch
     */
    public function deskSeat(): AssignmentReference
    {
        if (! $this->evidence instanceof DeskSeatEvidence) {
            throw MembershipEvidenceMismatch::notDesk($this->actor);
        }

        return $this->evidence->seat;
    }

    /**
     * The interval id of a chat membership.
     *
     * @throws MembershipEvidenceMismatch
     */
    public function interval(): string
    {
        if (! $this->evidence instanceof ChatIntervalEvidence) {
            throw MembershipEvidenceMismatch::notChat($this->actor);
        }

        return $this->evidence->intervalId;
    }

    public function isChat(): bool
    {
        return $this->evidence instanceof ChatIntervalEvidence;
    }
}
