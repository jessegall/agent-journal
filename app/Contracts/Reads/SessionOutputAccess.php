<?php

declare(strict_types=1);

namespace App\Contracts\Reads;

use App\Values\SessionOutputPaths;

/**
 * The saved outputs a journal session may read back: only those its current process start granted in its newest
 * mapping. A session with no running start, or a stale mapping, reads none.
 */
interface SessionOutputAccess
{
    /**
     * @return list<SessionOutputPaths>
     */
    public function grantedTo(string $sessionId): array;

    /**
     * Whether the current reader may read the file at the path the session wrote.
     */
    public function mayRead(string $sessionId, string $path): bool;
}
