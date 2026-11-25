<?php

declare(strict_types=1);

namespace App\Enums\Sharing;

/**
 * What became of one claimed gateway operation, as the supervisor reports it: done, or failed. Nothing else of the
 * program's output is kept.
 */
enum GatewayOutcome: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
}
