<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The person's ask, through their host, to open an agent's main runtime in a folder of that host.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class MainRuntimeRequestData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly string $folder,
        public readonly string $program,
        public readonly string $programBuild,
        public readonly string $profile,
        public readonly string|null $model = null,
    ) {}
}
