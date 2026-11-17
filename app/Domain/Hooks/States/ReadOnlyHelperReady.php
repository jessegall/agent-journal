<?php

declare(strict_types=1);

namespace App\Domain\Hooks\States;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\ShellCommandRequested;

/**
 * The bottom state of a read-only helper: every main agent rule holds, and nothing it runs or edits may change a file.
 */
class ReadOnlyHelperReady extends MainAgentReady
{
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->command->isFullyRead() && $input->command->mayChangeFiles()) {
            return Decision::deny('A read-only helper changes no files: run only commands that read.');
        }

        return parent::onShellCommand($input);
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        $paths = implode(', ', $input->changes->paths());

        return Decision::deny("A read-only helper changes no files, so this edit of {$paths} is refused.");
    }
}
