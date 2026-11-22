<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\SessionOutputAccess;
use App\Models\ProcessStart;
use App\Models\SessionOutputGrant;

/**
 * Reads a session's output grants of its current start and newest mapping generation only.
 */
final readonly class GrantedSessionOutputs implements SessionOutputAccess
{
    public function grantedTo(string $sessionId): array
    {
        $start = ProcessStart::currentOf($sessionId);

        return $start === null ? [] : SessionOutputGrant::currentOf($start);
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
