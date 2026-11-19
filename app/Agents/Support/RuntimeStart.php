<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\AgentRuntime;

/**
 * What a host needs to start a runtime's program: its driver type, the session it runs, the program and the build it
 * was opened for, the folder it works in, the process generation to start under and the model and effort asked for.
 */
final readonly class RuntimeStart
{
    public function __construct(
        public string $driverType,
        public string $sessionId,
        public string $program,
        public string $programBuild,
        public string $folder,
        public int $processGeneration,
        public string|null $model,
        public string|null $effort,
    ) {}

    public static function of(AgentRuntime $runtime): self
    {
        return new self(
            $runtime->driver_type->value,
            $runtime->agent_session_id,
            $runtime->program,
            $runtime->program_build,
            $runtime->canonical_folder,
            $runtime->process_generation,
            $runtime->requested_model,
            $runtime->requested_effort,
        );
    }

    /**
     * @return array{driver_type: string, session_id: string, program: string, program_build: string, folder: string,
     *     process_generation: int, model: string|null, effort: string|null}
     */
    public function toArray(): array
    {
        return [
            'driver_type' => $this->driverType,
            'session_id' => $this->sessionId,
            'program' => $this->program,
            'program_build' => $this->programBuild,
            'folder' => $this->folder,
            'process_generation' => $this->processGeneration,
            'model' => $this->model,
            'effort' => $this->effort,
        ];
    }
}
