<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Values\StackTarget;
use App\Values\ToolLine;

/**
 * Keeps the tool call each agent's activity line names, as its hooks start, finish and clear it.
 */
interface RunningTools
{
    /**
     * The agent's hooks let a tool call run, named by the line.
     */
    public function started(StackTarget $target, ToolLine $line): void;

    /**
     * The agent's running tool call finished; its line stays a while.
     */
    public function finished(StackTarget $target): void;

    /**
     * A new turn or context of the agent began, so no tool call is named.
     */
    public function cleared(StackTarget $target): void;
}
