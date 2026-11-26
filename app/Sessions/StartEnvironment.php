<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Sessions\Exceptions\StartSettingMissing;

/**
 * The environment the journal's start gave a driver, read one required setting at a time.
 */
final readonly class StartEnvironment
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
     * @throws StartSettingMissing
     */
    public function value(string $name): string
    {
        if (! $this->has($name)) {
            throw StartSettingMissing::forName($name);
        }

        return $this->variables[$name];
    }
}
