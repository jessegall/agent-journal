<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Contracts\PipelineRunner;
use App\Support\CommandRegistry;

/**
 * The command registries this process already checked, by the owners and commands they were built from. Reflecting
 * every command is most of a boot, so a boot with the same owners, commands and middleware reuses the registry, and a
 * different set is checked anew.
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
            fn (CommandOwner $owner) => [
                $owner->name,
                $owner->commands,
                $owner->middleware,
                $owner->requires,
            ],
            $owners,
        )));

        return self::$built[$key] ??= CommandRegistry::from($owners, $pipelines);
    }
}
