<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Actions\StackCleanups;
use Illuminate\Container\Attributes\Bind;

/**
 * Takes the finished frames off one stack inside the caller's command transaction, calling their exits and the resume
 * of the frame that comes back on top. A command that ends a subject calls it after locking that subject.
 */
#[Bind(StackCleanups::class)]
interface StackCleanup
{
    public function removeFinished(StackTarget $target): void;
}
