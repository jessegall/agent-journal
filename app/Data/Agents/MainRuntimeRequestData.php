<?php

declare(strict_types=1);

namespace App\Data\Agents;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The user's ask, through their host, to open an agent's main runtime in a folder of that host.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class MainRuntimeRequestData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly string $folder,
        public readonly string $driver,
        public readonly string $driverBuild,
        public readonly string $profile,
        public readonly string|null $model = null,
    ) {}
}
