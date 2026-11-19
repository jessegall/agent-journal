<?php

declare(strict_types=1);

namespace App\Agents\Resolvers\Support;

use App\Agents\Exceptions\LaunchMaterialMissing;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\LaunchMaterial;
use App\Registries\Support\Registry;

/**
 * Holds the token and settings of the launches accepted in this request until the host reads them; the token is
 * never stored, so a later request cannot read it again.
 */
final class HostLaunchMaterial
{
    /**
     * @var Registry<LaunchMaterial>
     */
    private readonly Registry $materials;

    public function __construct()
    {
        $this->materials = Registry::replacing(LaunchMaterialMissing::forRequest(...));
    }

    public function keep(string $requestId, LaunchedAgent $launched): void
    {
        $this->materials->put($requestId, $launched->material());
    }

    public function material(string $requestId): LaunchMaterial
    {
        return $this->materials->get($requestId);
    }
}
