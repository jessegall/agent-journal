<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\WorkBudgetSpent;

/**
 * The work one provider call may still do: candidates it may examine, related rows and policy checks it may make,
 * bytes of source text it may read and the moment it must stop. A provider charges each before the read that does
 * it, so a call that would go past its allowance stops before it reads.
 */
final class WorkBudget
{
    public const int CANDIDATE_LIMIT = 32;

    public const int RELATIONSHIP_LIMIT = 64;

    public const int POLICY_CHECK_LIMIT = 64;

    public const int BYTE_LIMIT = 65_536;

    private int $spentCandidates = 0;

    private int $spentRelationships = 0;

    private int $spentPolicyChecks = 0;

    private int $spentBytes = 0;

    private readonly int $startedNanoseconds;

    public function __construct(
        public readonly int $candidates,
        public readonly int $bytes,
        public readonly int $deadlineNanoseconds,
        public readonly int $relationships = self::RELATIONSHIP_LIMIT,
        public readonly int $policyChecks = self::POLICY_CHECK_LIMIT,
    ) {
        $this->startedNanoseconds = hrtime(true);
    }

    /**
     * The standard allowance of one batch, ending after the given milliseconds from now.
     */
    public static function forBatch(int $milliseconds): self
    {
        return new self(self::CANDIDATE_LIMIT, self::BYTE_LIMIT, hrtime(true) + $milliseconds * 1_000_000);
    }

    /**
     * The same allowance, unspent, for the next call: its time runs again from now.
     */
    public function renewed(): self
    {
        $duration = max(0, $this->deadlineNanoseconds - $this->startedNanoseconds);

        return new self(
            $this->candidates,
            $this->bytes,
            hrtime(true) + $duration,
            $this->relationships,
            $this->policyChecks,
        );
    }

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeCandidates(int $count): void
    {
        $this->spentCandidates = self::charged('candidates', $this->spentCandidates, $count, $this->candidates);
    }

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeRelationships(int $count): void
    {
        $this->spentRelationships = self::charged(
            'related rows',
            $this->spentRelationships,
            $count,
            $this->relationships,
        );
    }

    /**
     * @throws WorkBudgetSpent
     */
    public function chargePolicyChecks(int $count): void
    {
        $this->spentPolicyChecks = self::charged(
            'policy checks',
            $this->spentPolicyChecks,
            $count,
            $this->policyChecks,
        );
    }

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeBytes(int $count): void
    {
        $this->spentBytes = self::charged('bytes', $this->spentBytes, $count, $this->bytes);
    }

    /**
     * The candidates examined and the bytes read so far, for diagnostics.
     */
    public function spentCandidates(): int
    {
        return $this->spentCandidates;
    }

    public function spentBytes(): int
    {
        return $this->spentBytes;
    }

    public function remainingCandidates(): int
    {
        return max(0, $this->candidates - $this->spentCandidates);
    }

    public function remainingBytes(): int
    {
        return max(0, $this->bytes - $this->spentBytes);
    }

    public function hasTimeLeft(): bool
    {
        return hrtime(true) < $this->deadlineNanoseconds;
    }

    public function remainingMilliseconds(): int
    {
        return max(0, intdiv($this->deadlineNanoseconds - hrtime(true), 1_000_000));
    }

    /**
     * @throws WorkBudgetSpent
     */
    private static function charged(string $work, int $spent, int $count, int $allowance): int
    {
        if ($spent + $count > $allowance) {
            throw WorkBudgetSpent::of($work, $allowance);
        }

        return $spent + $count;
    }
}
