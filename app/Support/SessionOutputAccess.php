<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reads\SessionOutputAccess as SessionOutputAccessContract;
use App\Models\Sessions\SessionOutputGrant;
use App\Models\Sessions\SessionProcess;

/**
 * Reads a session's output grants of its current start and newest mapping generation only.
 */
final readonly class SessionOutputAccess implements SessionOutputAccessContract
{
    public function grantedTo(string $sessionId): array
    {
        $start = SessionProcess::currentOf($sessionId);

        if ($start === null) {
            return [];
        }

        return SessionOutputGrant::currentOf($start);
    }

    public function mayRead(string $sessionId, string $path): bool
    {
        foreach ($this->grantedTo($sessionId) as $paths) {
            if ($paths->contains($path)) {
                return true;
            }
        }

        return false;
    }
}
