<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Inputs\ProtectedFileRead;

/**
 * Decides which native file reads, file changes and shell commands of a session reach protected account resources.
 */
interface ProtectedResources
{
    /**
     * Whether a read names a protected path the session holds no output grant for.
     */
    public function refusesRead(string $sessionId, ProtectedFileRead $read): bool;

    /**
     * Whether a file change lands in a protected folder; no session may change one.
     */
    public function refusesChange(string $path): bool;

    public function refusesCommand(string $command): bool;
}
