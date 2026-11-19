<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * What a driver request carries beside its operation: the message to deliver, the model or effort to switch to, or
 * the key script to run with its version and parameters; an interrupt, stop or wake carries nothing.
 */
final readonly class DriverRequestPayload
{
    /**
     * @param  array<string, string>|null  $scriptParameters
     */
    private function __construct(
        public string|null $message = null,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $scriptId = null,
        public int|null $scriptVersion = null,
        public array|null $scriptParameters = null,
    ) {}

    public static function nothing(): self
    {
        return new self();
    }

    public static function message(string $message): self
    {
        return new self(message: $message);
    }

    public static function model(string $model): self
    {
        return new self(model: $model);
    }

    public static function effort(string $effort): self
    {
        return new self(effort: $effort);
    }

    /**
     * @param  array<string, string>  $parameters
     */
    public static function keyScript(string $scriptId, int $version, array $parameters): self
    {
        return new self(scriptId: $scriptId, scriptVersion: $version, scriptParameters: $parameters);
    }

    /**
     * A digest of the operation and everything the payload carries, so a repeated key with other content conflicts.
     */
    public function digestFor(string $operation): string
    {
        $content = [
            $this->message,
            $this->model,
            $this->effort,
            $this->scriptId,
            $this->scriptVersion,
            $this->scriptParameters,
        ];

        return hash('sha256', $operation."\n".json_encode($content, JSON_THROW_ON_ERROR));
    }
}
