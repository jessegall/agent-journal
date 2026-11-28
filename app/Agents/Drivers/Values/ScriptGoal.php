<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Values;

/**
 * What a key script run is for: the script with its version and parameters, such as ChangeEffort effort=low. A
 * navigation request navigates to it and a menu entry replays it.
 */
final readonly class ScriptGoal
{
    /**
     * @param  array<string, string>  $parameters
     */
    public function __construct(
        public string $script,
        public int $version,
        public array $parameters,
    ) {}

    /**
     * The parameters ordered by name, so two equal goals are stored the same.
     *
     * @return array<string, string>
     */
    public function sortedParameters(): array
    {
        $parameters = $this->parameters;
        ksort($parameters);

        return $parameters;
    }

    /**
     * The goal's lookup key: a hash of its script, version and parameters in name order.
     */
    public function key(): string
    {
        $goal = [
            $this->script,
            $this->version,
            $this->sortedParameters(),
        ];

        return hash('sha256', json_encode($goal, JSON_THROW_ON_ERROR));
    }
}
