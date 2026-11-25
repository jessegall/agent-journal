<?php

declare(strict_types=1);

namespace App\Enums\Search;

/**
 * Why a source could not answer, in words that reveal no query, record or private text.
 */
enum FailureReason: string
{
    case SourceUnavailable = 'source_unavailable';
    case StorageFailed = 'storage_failed';
    case PositionRejected = 'position_rejected';
    case BatchInvalid = 'batch_invalid';
}
