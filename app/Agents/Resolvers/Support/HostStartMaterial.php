<?php

declare(strict_types=1);

namespace App\Agents\Resolvers\Support;

use App\Agents\Exceptions\StartMaterialMissing;
use App\Agents\Support\StartedAgent;
use App\Agents\Support\StartMaterial;
use App\Registries\Support\Registry;

/**
 * Holds the token and settings of the starts accepted in this request until the host reads them; the token is
 * never stored, so a later request cannot read it again.
 */
final class HostStartMaterial
{
    /**
     * @var Registry<StartMaterial>
     */
    private readonly Registry $materials;

    public function __construct()
    {
        $this->materials = Registry::replacing(StartMaterialMissing::forRequest(...));
    }

    public function keep(string $requestId, StartedAgent $started): void
    {
        $this->materials->put($requestId, $started->material());
    }

    public function material(string $requestId): StartMaterial
    {
        return $this->materials->get($requestId);
    }
}
