<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\LaunchMaterialMissing;
use App\Agents\Support\LaunchMaterial;

/**
 * The host's read of what it needs to start an accepted launch: the token, handed out once, and the isolated
 * settings. Only the host reads it; no receipt carries it.
 */
interface LaunchMaterialReader
{
    /**
     * @throws LaunchMaterialMissing
     */
    public function material(string $requestId): LaunchMaterial;
}
