<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Actions\StackCleanups;
use Closure;
use Illuminate\Container\Attributes\Bind;

/**
 * Takes the finished frames off one stack inside the caller's command transaction, calling their exits and the resume
 * of the frame that comes back on top. A command that ends a subject calls it after locking that subject.
 */
#[Bind(StackCleanups::class)]
interface StackCleanup
{
    public function removeFinished(StackTarget $target): void;

    /**
     * Ends a locked record's work: makes the change, then settles the stack the record was worked on, so the agent is
     * back on its earlier work before the command returns.
     *
     * @template TRecord of WorkedOnStack
     *
     * @param  TRecord  $record
     * @param  Closure(TRecord): void  $change
     */
    public function endWork(WorkedOnStack $record, Closure $change): void;
}
