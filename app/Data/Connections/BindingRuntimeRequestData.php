<?php

declare(strict_types=1);

namespace App\Data\Connections;

use App\Commands\AssertBindingStart\AssertBindingStartCommand;
use App\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
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
        public readonly string $model,
        public readonly string $startId = '',
    ) {}

    /**
     * The check that this host may start the binding's main runtime in this root, before any grant.
     */
    public function asBindingStart(string $hostId, string $bindingId): AssertBindingStartCommand
    {
        return new AssertBindingStartCommand($hostId, $bindingId, $this->rootId, $this->folder, $this->agentId, $this->driver);
    }

    /**
     * The opening of the binding's main runtime on this host, as the owner selected it.
     */
    public function asMainRuntime(string $hostId): OpenBindingMainRuntimeCommand
    {
        return new OpenBindingMainRuntimeCommand(
            $this->agentId,
            $hostId,
            $this->folder,
            $this->driver,
            $this->driverBuild,
            $this->profile,
            $this->model,
        );
    }
}
