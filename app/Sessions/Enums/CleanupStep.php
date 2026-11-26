<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

/**
 * A transient resource of a container start the host removes once the start ended: its container, its start
 * network and its ephemeral runtime folder. The workspace is never one of them.
 */
enum CleanupStep: string
{
    case Container = 'container';
    case Network = 'network';
    case Runtime = 'runtime';
}
