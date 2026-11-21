<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Agents\Commands\OpenHostMainRuntime;
use App\Connections\Commands\AssertBindingStart;
use App\Drivers\Enums\HookDriver;
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
        public readonly HookDriver $driver,
        public readonly string $driverBuild,
        public readonly string $profile,
        public readonly string|null $model = null,
        public readonly string $startId = '',
    ) {}

    /**
     * The check that this host may start the binding's main runtime in this root, before any grant.
     */
    public function asBindingStart(string $hostId, string $bindingId): AssertBindingStart
    {
        return new AssertBindingStart($hostId, $bindingId, $this->rootId, $this->folder, $this->agentId, $this->driver);
    }

    /**
     * The opening of the binding's main runtime on this host, as the owner selected it.
     */
    public function asMainRuntime(string $hostId): OpenHostMainRuntime
    {
        return new OpenHostMainRuntime(
            $this->agentId,
            $hostId,
            $this->folder,
            $this->driver->value,
            $this->driverBuild,
            $this->profile,
            $this->model,
        );
    }
}
