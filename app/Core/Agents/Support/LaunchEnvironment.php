<?php

declare(strict_types=1);

namespace App\Core\Agents\Support;

use App\Core\Agents\Exceptions\LaunchSettingMissing;

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
     * @throws LaunchSettingMissing
     */
    public function value(string $name): string
    {
        if (! array_key_exists($name, $this->variables)) {
            throw LaunchSettingMissing::forName($name);
        }

        return $this->variables[$name];
    }
}
