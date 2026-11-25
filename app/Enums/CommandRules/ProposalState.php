<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * Where a rule proposal stands: a draft still misses a required field, a pending one
 * waits for the owner's review, and the other four are ended.
 */
enum ProposalState: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';
    case Superseded = 'superseded';

    /**
     * Whether a new revision may still be added: only before the owner decided and before it was withdrawn.
     */
    public function canAcceptRevision(): bool
    {
        return $this === self::Draft || $this === self::Pending;
    }
}
