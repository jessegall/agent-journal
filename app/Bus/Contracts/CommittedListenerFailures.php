<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Exceptions\CommittedFactListenerFailed;

/**
 * Where the failure of a listener on a committed fact goes: the command committed, so its caller is never failed by it.
 */
interface CommittedListenerFailures
{
    /** Reports a failed listener after the command commits. */
    public function take(CommittedFactListenerFailed $failure): void;
}
