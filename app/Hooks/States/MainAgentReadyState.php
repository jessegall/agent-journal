<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ShellCommandRequested;

/**
 * The bottom state of a main agent: a test or build runs only through its approved proven reader, and a line the
 * parser could not read fully is never taken as safe.
 */
class MainAgentReadyState extends ReadyState
{
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->isFullyRead()) {
            return Decision::deny('This line could not be read fully: write it without dynamic parts.');
        }

        if ($input->command->needsAlias()) {
            return Decision::deny('A test or build runs only with its approved proven reader: run journal command-type'
                .' explain on the line to see the request that holds it and its next step.');
        }

        return parent::onShellCommand($input);
    }
}
