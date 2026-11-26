<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Models\Sessions\SessionOutputGrant;
use App\Models\Sessions\SessionProcess;
use App\Reads\Contracts\SessionOutputAccess as SessionOutputAccessContract;

/**
 * Reads a session's output grants of its current start and newest mapping generation only.
 */
final readonly class SessionOutputAccess implements SessionOutputAccessContract
{
    public function grantedTo(string $sessionId): array
    {
        $start = SessionProcess::findCurrentOf($sessionId);

        if ($start === null) {
            return [];
        }

        return SessionOutputGrant::resolveCurrentOf($start);
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
