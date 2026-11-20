<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * How many helpers of a profile may exist at once: one designated helper for the whole installation, a fresh one for
 * each new job, or reuse of the best fitting idle one.
 */
enum InstancePolicy: string
{
    case Single = 'single';
    case PerJob = 'per_job';
    case Reusable = 'reusable';
}
