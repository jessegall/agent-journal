<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use App\Processes\Models\RuleProposal;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project owner rejected a proposal; its author hears the reason, and the proposal and its request stay readable.
 */
final readonly class RuleRejected implements Event, ShouldDispatchAfterCommit
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
