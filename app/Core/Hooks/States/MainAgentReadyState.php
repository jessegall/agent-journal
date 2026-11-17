<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\ShellCommandRequested;

/**
 * The bottom state of a main agent: a test run or a build must run as a saved command, and a line the parser could not read fully is never taken as safe.
 */
class MainAgentReadyState extends ReadyState
{
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->isFullyRead()) {
            return Decision::deny('This line could not be read fully: write it without dynamic parts, or save it as a named command and run it through journal run.');
        }

        if ($input->command->needsSavedCommand()) {
            return Decision::deny('Save this test or build as a named command, then run it through journal run.');
        }

        return parent::onShellCommand($input);
    }
}
