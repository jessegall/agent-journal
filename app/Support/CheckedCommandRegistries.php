<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\PipelineRunner;

/**
 * The command registries this process already checked, by the owners and commands they were built from. Reflecting
 * every command is the largest part of a boot, and the code cannot change while the process runs, so a boot with the
 * same owners, commands and middleware takes the registry built before; a different set, such as a test's module
 * fixture, is built and checked anew.
 */
final class CheckedCommandRegistries
{
    /**
     * @var array<string, CommandRegistry>
     */
    private static array $built = [];

    /**
     * @param  list<CommandOwner>  $owners
     */
    public static function for(array $owners, PipelineRunner $pipelines): CommandRegistry
    {
        $key = hash('sha256', serialize(array_map(
            fn (CommandOwner $owner) => [$owner->name, $owner->commands, $owner->middleware, $owner->requires],
            $owners,
        )));

        return self::$built[$key] ??= CommandRegistry::from($owners, $pipelines);
    }
}
