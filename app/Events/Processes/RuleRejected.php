<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Models\CommandRules\RuleProposal;

/**
 * A project owner rejected a proposal; its author is told the reason, and the proposal and its request stay readable.
 */
final readonly class RuleRejected extends ProcessEvent
{
    public function __construct(
        public string $proposalId,
        public string $authorType,
        public string $authorId,
        public string $reason,
    ) {}

    public static function forProposal(RuleProposal $proposal, string $reason): self
    {
        return new self($proposal->id, $proposal->author_type, $proposal->author_id, $reason);
    }
}
