<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Agents\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Projects\Commands\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Values\DriverFamily;
use Spatie\LaravelData\Data;

/**
 * A binding relay's ask to open its main runtime: the root id and folder it runs in, the agent, and the driver, profile
 * and model the owner selected; the journal pins the build.
 */
final class BindingRuntimeRequestData extends Data
{
    public function __construct(
        public readonly string $rootId,
        public readonly string $folder,
        public readonly string $agentId,
        public readonly string $driver,
        public readonly string $profile,
        public readonly string $model,
        public readonly string|null $startId = null,
        public readonly string|null $effort = null,
    ) {}

    public function withDriver(DriverFamily $family): self
    {
        return clone ($this, ['driver' => $family->key]);
    }

    /**
     * The check that this host may start the binding's main runtime in this root, before any grant.
     */
    public function asBindingRuntime(string $hostId, string $bindingId): AssertBindingRuntimeCommand
    {
        return new AssertBindingRuntimeCommand(
            $hostId,
            $bindingId,
            $this->rootId,
            $this->folder,
            $this->agentId,
            $this->driver,
        );
    }

    /**
     * The opening of the binding's main runtime on this host, as the owner selected it.
     */
    public function asMainRuntime(string $hostId, string $driverBuild): OpenBindingMainRuntimeCommand
    {
        return new OpenBindingMainRuntimeCommand(
            $this->agentId,
            $hostId,
            $this->folder,
            $this->driver,
            $driverBuild,
            $this->profile,
            $this->model,
            $this->effort,
        );
    }
}
