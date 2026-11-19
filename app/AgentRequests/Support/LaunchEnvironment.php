<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Exceptions\LaunchSettingMissing;

/**
 * The environment the journal's launch gave a program, read one required setting at a time.
 */
final readonly class LaunchEnvironment
{
    /**
     * @param  array<string, string>  $variables
     */
    public function __construct(private array $variables) {}

    /**
     * The environment this process was started with.
     */
    public static function ofThisProcess(): self
    {
        return new self(array_filter(getenv(), is_string(...)));
    }

    public function has(string $name): bool
    {
        return array_key_exists($name, $this->variables);
    }

    /**
     * @throws LaunchSettingMissing
     */
    public function value(string $name): string
    {
        if (! $this->has($name)) {
            throw LaunchSettingMissing::forName($name);
        }

        return $this->variables[$name];
    }
}
