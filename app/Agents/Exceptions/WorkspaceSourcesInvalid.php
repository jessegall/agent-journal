<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use InvalidArgumentException;
use Throwable;

/**
 * AGENTS_WORKSPACES is not a JSON object of one Git source or one folder per environment; the journal does not boot.
 */
final class WorkspaceSourcesInvalid extends InvalidArgumentException
{
    public static function malformed(Throwable|null $previous = null): self
    {
        return new self('AGENTS_WORKSPACES is not a JSON object keyed by environment name.', 0, $previous);
    }

    public static function gitAndFolder(string $environment): self
    {
        return new self("AGENTS_WORKSPACES gives the environment {$environment} both a Git source and a folder.");
    }

    public static function incomplete(string $environment, Throwable $previous): self
    {
        return new self("AGENTS_WORKSPACES gives the environment {$environment} neither a folder nor a Git source "
            .'with its revision and deploy key secret.', 0, $previous);
    }
}
