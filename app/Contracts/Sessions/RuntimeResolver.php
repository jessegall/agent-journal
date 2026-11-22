<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Data\DriverRequestStatus;
use App\Data\RuntimeStatus;
use App\Exceptions\StackTargetRefused;

/**
 * Reads the stored status of agent runtimes and their requests for the current actor, who sees only the sessions
 * it may see. Nothing here calls a host: inspecting a runtime is reading what hosts last reported.
 */
interface RuntimeResolver
{
    /**
     * @return list<RuntimeStatus>
     */
    public function page(int $page, int $perPage): array;

    /**
     * @throws StackTargetRefused
     */
    public function forSession(string $sessionId): RuntimeStatus;

    /**
     * The folder the session's runtime works in, as its host registered it.
     *
     * @throws StackTargetRefused
     */
    public function folderOf(string $sessionId): string;

    /**
     * The newest requests of a session's runtime, newest first.
     *
     * @return list<DriverRequestStatus>
     *
     * @throws StackTargetRefused
     */
    public function requestsOf(string $sessionId, int $limit): array;
}
