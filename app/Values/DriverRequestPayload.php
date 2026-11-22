<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a driver request carries beside its operation: the message to deliver, the model or effort to switch to, or
 * the key script to run with its version and parameters; an interrupt, stop or wake carries nothing.
 */
final readonly class DriverRequestPayload
{
    /**
     * @param  array<string, string>  $scriptParameters
     */
    private function __construct(
        public string|null $message = null,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $scriptId = null,
        public int|null $scriptVersion = null,
        public array $scriptParameters = [],
        public NavigationRound|null $navigationRound = null,
    ) {}

    public static function nothing(): self
    {
        return new self();
    }

    public static function message(string $message): self
    {
        return new self(message: $message);
    }

    /**
     * A browser writer's operation for the host's input gate, its fields as the host reads them from the message.
     *
     * @param  array<string, string|int|bool|null>  $fields
     */
    public static function terminalControl(array $fields): self
    {
        return new self(message: json_encode($fields, JSON_THROW_ON_ERROR));
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
     * One round of the main agent's navigation of a stalled runtime.
     */
    public static function navigate(NavigationRound $round): self
    {
        return new self(navigationRound: $round);
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
            $this->navigationRound?->toStored(),
        ];

        return hash('sha256', $operation."\n".json_encode($content, JSON_THROW_ON_ERROR));
    }
}
