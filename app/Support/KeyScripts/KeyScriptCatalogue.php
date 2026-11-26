<?php

declare(strict_types=1);

namespace App\Support\KeyScripts;

use App\Exceptions\KeyScriptMissing;

/**
 * The key scripts each driver build may run, by name. A build with no script of that name runs the one of the newest
 * older build that has it, each step still waiting for its own screen; nothing else runs.
 */
final readonly class KeyScriptCatalogue
{
    /**
     * @param  list<KeyScript>  $scripts
     */
    public function __construct(private array $scripts) {}

    public function scriptFor(string $driver, string $build, string $name): KeyScript
    {
        $fitting = array_filter(
            $this->scripts,
            fn (KeyScript $script) => $script->driver === $driver
                && $script->name === $name
                && version_compare($script->build, $build, '<='),
        );

        usort($fitting, fn (KeyScript $one, KeyScript $other) => version_compare($other->build, $one->build));

        return $fitting[0] ?? throw KeyScriptMissing::of($name, $driver, $build);
    }
}
