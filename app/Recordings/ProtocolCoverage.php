<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;

/**
 * The calls, instruction types and refusals the recordings still need to cover.
 */
final readonly class ProtocolCoverage
{
    /**
     * @param  list<HostRoute>  $routes
     * @param  list<HostInstructionType>  $instructionTypes
     * @param  list<HostRefusal>  $refusals
     * @param  list<string>  $relayRoutes
     */
    public function __construct(
        public array $routes,
        public array $instructionTypes,
        public array $refusals,
        public array $relayRoutes,
    ) {}

    public function isWhole(): bool
    {
        return $this->routes === [] && $this->instructionTypes === [] && $this->refusals === [] && $this->relayRoutes === [];
    }
}
