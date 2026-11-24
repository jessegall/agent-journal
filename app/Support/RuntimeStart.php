<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agents\AgentRuntime;
use App\Values\DriverLimits;

/**
 * What a host needs to start a runtime's driver: the session it runs, the driver and the build it was opened for,
 * the folder it works in, the process generation to start under, the model and effort asked for and the waits its
 * driver keeps.
 */
final readonly class RuntimeStart
{
    /**
     * The Claude sign-in methods the journal accepts for an account start, as the program names them: OAuth, a
     * provider token read from a descriptor, and an API key from the account folder's apiKeyHelper.
     */
    public const array CLAUDE_SIGN_IN_METHODS = ['claude.ai', 'oauth_token', 'api_key_helper'];

    public function __construct(
        public string $sessionId,
        public string $driver,
        public string $driverKey,
        public string $driverBuild,
        public string $folder,
        public int $processGeneration,
        public string|null $model,
        public string|null $effort,
        public DriverLimits $limits = new DriverLimits(),
    ) {}

    public static function of(AgentRuntime $runtime): self
    {
        return new self(
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
     * @return array{session_id: string, driver: string, driver_key: string, driver_build: string, folder: string,
     *     process_generation: int, model: string|null, effort: string|null, limits: array<string, int>,
     *     sign_in_methods: list<string>}
     */
    public function toArray(): array
    {
        return [
            'session_id' => $this->sessionId,
            'driver' => $this->driver,
            'driver_key' => $this->driverKey,
            'driver_build' => $this->driverBuild,
            'folder' => $this->folder,
            'process_generation' => $this->processGeneration,
            'model' => $this->model,
            'effort' => $this->effort,
            'limits' => $this->limits->toArray(),
            'sign_in_methods' => self::CLAUDE_SIGN_IN_METHODS,
        ];
    }
}
