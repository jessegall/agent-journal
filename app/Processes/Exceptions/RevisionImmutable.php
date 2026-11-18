<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A stored revision was about to change: a reader revision, a proposal revision or an approved rule revision is never
 * updated, a new revision is written instead.
 */
final class RevisionImmutable extends LogicException
{
    public static function reader(string $id): self
    {
        return new self("Reader revision {$id} is never updated; write a new revision.");
    }

    public static function proposal(string $id): self
    {
        return new self("Proposal revision {$id} is never updated; revise the proposal instead.");
    }

    public static function rule(string $id): self
    {
        return new self("Approved rule revision {$id} is never updated; approve a new revision instead.");
    }
}
