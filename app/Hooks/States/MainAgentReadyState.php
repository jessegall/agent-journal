<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ShellCommandRequested;

/**
 * The bottom state of a main agent: a test run or a build must run through a command alias, and a line the parser could not read fully is never taken as safe.
 */
class MainAgentReadyState extends ReadyState
{
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->isFullyRead()) {
            return Decision::deny('This line could not be read fully: write it without dynamic parts, or save it as a named command and run it through journal run.');
        }

        if ($input->command->needsAlias()) {
            return Decision::deny('Save this test or build as a named command, then run it through journal run.');
        }

        return parent::onShellCommand($input);
    }
}
