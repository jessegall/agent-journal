<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Git could not fetch a certified helper checkout into the parent repository; no branch changed and the import may be
 * retried.
 */
final class HelperImportFailed extends RuntimeException
{
    public static function for(string $worktree, string $output): self
    {
        return new self("Importing the commits of {$worktree} failed, and no branch changed: {$output}");
    }
}
