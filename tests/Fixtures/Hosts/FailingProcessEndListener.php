<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hosts;

use App\Events\Connections\HostProcessExited;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A listener of a host process's end whose own store is down, so it fails on every process that ends.
 */
final class FailingProcessEndListener
{
    public function handle(HostProcessExited $exited): void
    {
        throw SimulatedFailure::of("The store is down while hearing {$exited->processId} end.");
    }
}
