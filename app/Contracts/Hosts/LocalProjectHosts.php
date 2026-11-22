<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

/**
 * Which hosts serve a connected project: a local host that a live binding names. Agents asks it before a host
 * speaking the connected projects' protocol may claim, start or report work; Connections answers it.
 */
interface LocalProjectHosts
{
    /**
     * The live binding the host serves, none or one: each binding has a host of its own.
     *
     * @return list<string>
     */
    public function liveBindingOf(string $hostId): array;
}
