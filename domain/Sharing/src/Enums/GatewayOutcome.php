<?php

declare(strict_types=1);

namespace Domain\Sharing\Enums;

/**
 * What became of one claimed gateway operation, as the supervisor reports it: done, or failed. Nothing else of the
 * program's output is kept.
 */
enum GatewayOutcome: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
}
