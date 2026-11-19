<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

/**
 * Codex is never told to trust a folder an agent could fill with its own .codex settings, hooks or MCP servers: only
 * an existing, empty working root the journal made, by its exact path.
 */
final class FolderTrustRefused extends RuntimeException
{
    public static function outsideWorkingRoots(string $folder): self
    {
        return new self(
            "The folder {$folder} is not one of the journal's own working roots, so Codex is not told to trust it.",
        );
    }

    public static function notEmpty(string $folder): self
    {
        return new self("The working root {$folder} is not empty, so Codex is not told to trust it.");
    }
}
