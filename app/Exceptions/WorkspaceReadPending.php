<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Values\WorkspaceReadReference;
use RuntimeException;

/**
 * A workspace read the host has not answered yet; the reader retained it, and its reference is the receipt the
 * suspended instruction resumes on.
 */
final class WorkspaceReadPending extends RuntimeException
{
    private function __construct(public readonly WorkspaceReadReference $reference, string $message)
    {
        parent::__construct($message);
    }

    public static function for(WorkspaceReadReference $reference): self
    {
        return new self($reference, "The workspace read {$reference->key} waits for its host.");
    }
}
