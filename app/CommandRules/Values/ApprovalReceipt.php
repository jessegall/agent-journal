<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

use App\Models\CommandRules\RuleRevision;

/**
 * What an approval answers: the rule now active, its approved revision and that revision's digest.
 */
final readonly class ApprovalReceipt
{
    private function __construct(public string $ruleId, public int $revision, public string $digest) {}

    /**
     * @return array{rule_id: string, revision: int, digest: string}
     */
    public function toArray(): array
    {
        return [
            'rule_id' => $this->ruleId,
            'revision' => $this->revision,
            'digest' => $this->digest,
        ];
    }

    public static function of(RuleRevision $approved): self
    {
        return new self($approved->rule_id, $approved->revision, $approved->digest);
    }
}
