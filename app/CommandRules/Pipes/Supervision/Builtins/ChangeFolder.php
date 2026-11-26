<?php

declare(strict_types=1);

namespace App\CommandRules\Pipes\Supervision\Builtins;

use App\Attributes\Rules\OutsideThePlaces;
use App\Bus\Contracts\Pipe;
use App\CommandRules\Execution\BuiltinCall;
use App\CommandRules\Execution\BuiltinEnded;
use App\Files\Enums\PlaceExemption;
use App\Processes\Enums\ExitStatus;

/**
 * cd: moves the run into one folder, or home without one; a folder that is not there fails and moves nothing.
 */
final readonly class ChangeFolder implements Pipe
{
    #[OutsideThePlaces(PlaceExemption::CommandFileSystem)]
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        $context = $call->context();
        $target = $call->arguments[0] ?? ($context->environment['HOME'] ?? $context->workingFolder);
        $folder = realpath(str_starts_with($target, '/') ? $target : rtrim($context->workingFolder, '/').'/'.$target);

        if ($folder === false || ! is_dir($folder)) {
            return $call->ended(ExitStatus::Failure->status(), $context, '', "cd: {$target}: No such file or directory\n");
        }

        return $call->ended(ExitStatus::Success->status(), $context->withWorkingFolder($folder));
    }
}
