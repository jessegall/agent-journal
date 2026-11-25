<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Attributes\OutsideThePlaces;
use App\Contracts\Bus\Pipe;
use App\Enums\Files\PlaceExemption;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

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
