<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

/**
 * A transient resource of a container launch the host removes once the launch ended: its container, its launch
 * network and its ephemeral runtime folder. The workspace is never one of them.
 */
enum CleanupStep: string
{
    case Container = 'container';
    case Network = 'network';
    case Runtime = 'runtime';
}
