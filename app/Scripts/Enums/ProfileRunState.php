<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

/**
 * Where a profile script run stands: running its instructions, suspended on a step the host still owes, finished,
 * failed, or uncertain because a step's outcome cannot be known.
 */
enum ProfileRunState: string
{
    case Running = 'running';
    case Suspended = 'suspended';
    case Finished = 'finished';
    case Failed = 'failed';
    case Uncertain = 'uncertain';
}
