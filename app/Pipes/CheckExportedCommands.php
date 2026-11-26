<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Bus\CommandDeclarations;
use App\Bus\Contracts\Pipe;
use App\Bus\Exceptions\CommandDeclarationInvalid;

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
