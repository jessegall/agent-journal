<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Support\CommandDeclarations;
use App\Pipelines\Contracts\Pipe;

/**
 * Every command an owner exports is one it registers itself.
 */
final readonly class CheckExportedCommands implements Pipe
{
    public function handle(CommandDeclarations $declarations): CommandDeclarations
    {
        foreach ($declarations->owners as $owner) {
            $registered = array_map(strtolower(...), $owner->commands);

            foreach ($owner->exports->commands as $exported) {
                if (! in_array(strtolower($exported), $registered, true)) {
                    throw CommandDeclarationInvalid::exportedButNotRegistered($owner->name, $exported);
                }
            }
        }

        return $declarations;
    }
}
