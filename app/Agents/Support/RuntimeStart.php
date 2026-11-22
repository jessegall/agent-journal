<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\AgentRuntime;

/**
 * What a host needs to start a runtime's driver: its driver type, the session it runs, the driver and the build it
 * was opened for, the folder it works in, the process generation to start under and the model and effort asked for.
 */
final readonly class RuntimeStart
{
    public function __construct(
        public string $variant,
        public string $sessionId,
        public string $driver,
        public string $driverKey,
        public string $driverBuild,
        public string $folder,
        public int $processGeneration,
        public string|null $model,
        public string|null $effort,
    ) {}

    public static function of(AgentRuntime $runtime): self
    {
        return new self(
            $runtime->mode->value,
            $runtime->agent_session_id,
            $runtime->family,
            $runtime->driver_key,
            $runtime->driver_build,
            $runtime->canonical_folder,
            $runtime->process_generation,
            $runtime->requested_model,
            $runtime->requested_effort,
        );
    }

    /**
     * @return array{variant: string, session_id: string, driver: string, driver_key: string, driver_build: string, folder: string,
     *     process_generation: int, model: string|null, effort: string|null}
     */
    public function toArray(): array
    {
        return [
            'variant' => $this->variant,
            'session_id' => $this->sessionId,
            'driver' => $this->driver,
            'driver_key' => $this->driverKey,
            'driver_build' => $this->driverBuild,
            'folder' => $this->folder,
            'process_generation' => $this->processGeneration,
            'model' => $this->model,
            'effort' => $this->effort,
        ];
    }
}
