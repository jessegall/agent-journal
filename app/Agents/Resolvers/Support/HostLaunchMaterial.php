<?php

declare(strict_types=1);

namespace App\Agents\Resolvers\Support;

use App\Agents\Exceptions\LaunchMaterialMissing;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\LaunchMaterial;

/**
 * Holds the token and settings of the launches accepted in this request until the host reads them; the token is
 * never stored, so a later request cannot read it again.
 */
final class HostLaunchMaterial
{
    /**
     * @var array<string, LaunchMaterial>
     */
    private array $materials = [];

    public function keep(string $requestId, LaunchedAgent $launched): void
    {
        $this->materials[$requestId] = $launched->material();
    }

    public function material(string $requestId): LaunchMaterial
    {
        return $this->materials[$requestId] ?? throw LaunchMaterialMissing::forRequest($requestId);
    }
}
