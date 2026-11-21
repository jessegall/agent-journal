<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Contracts\ToolDiscovery;
use App\Agents\Models\AgentRuntime;
use App\Agents\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Answers the host whether its runtime's program discovered its journal tools in its current process generation, so
 * the host sends the work prompt only then. The host's calls run as the journal itself.
 */
final readonly class ToolDiscoveryController
{
    public function __invoke(string $runtime, HostContext $host, ToolDiscovery $discovery): JsonResponse
    {
        $session = AgentRuntime::sessionOfHostRuntime($host->hostId, $runtime);

        return new JsonResponse(['discovered' => $discovery->isDiscoveredInCurrentGeneration($session)]);
    }
}
