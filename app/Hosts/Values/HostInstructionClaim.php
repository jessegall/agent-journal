<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;

/**
 * What a host's claim answers: the instructions it takes now, how long it may go without calling before it is taken as
 * idle, and the journal's time, by which the host judges each instruction's expiry whatever its own clock says.
 */
final readonly class HostInstructionClaim
{
    /**
     * @param  list<HostInstructionPayload>  $instructions
     * @param  int|null  $retakeableInSeconds  when an instruction the host claimed and left unanswered may be handed out
     *                                         again; null when it holds none
     * @param  int  $idleWindowSeconds  how long a host that holds no live process stays online
     */
    public function __construct(
        public array $instructions,
        public string $now,
        public int|null $retakeableInSeconds,
        public int $idleWindowSeconds,
    ) {}

    public function isEmpty(): bool
    {
        return $this->instructions === [];
    }

    /**
     * How long a claim that found nothing may wait for a wake: no longer than asked, and no longer than until an
     * unanswered instruction may be handed out again.
     */
    public function waitSeconds(int $asked): int
    {
        return min($asked, $this->retakeableInSeconds ?? $asked);
    }

    /**
     * The claim as the journal answers the host's claim_instructions call with it.
     */
    public function reply(): HostClaimedInstructionsPayload
    {
        return HostClaimedInstructionsPayload::from([
            'instructions' => $this->instructions,
            'idle_window_seconds' => $this->idleWindowSeconds,
            'now' => $this->now,
        ]);
    }
}
