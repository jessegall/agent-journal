<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use Spatie\LaravelData\Data;

/**
 * A binding relay's ask to open its main runtime: the root id and folder it runs in, the agent, and the driver, build,
 * profile and model the owner selected.
 */
final class BindingRuntimeRequestData extends Data
{
    public function __construct(
        public readonly string $rootId,
        public readonly string $folder,
        public readonly string $agentId,
        public readonly string $driver,
        public readonly string $driverBuild,
        public readonly string $profile,
        public readonly string|null $model = null,
    ) {}
}
