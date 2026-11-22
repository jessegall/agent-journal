<?php

declare(strict_types=1);

namespace App\Agents\Enums;


/**
 * What became of one input a browser writer sent: still on its way, written, refused, written or not with no way to
 * know, or unknown to the journal.
 */
enum TerminalReceiptOutcome: string
{
    case Pending = 'pending';
    case Applied = 'applied';
    case Refused = 'refused';
    case Uncertain = 'uncertain';
    case Unknown = 'unknown';

    public static function ofProgress(RequestProgress $progress): self
    {
        return match ($progress) {
            RequestProgress::Accepted, RequestProgress::Staged, RequestProgress::Applying => self::Pending,
            RequestProgress::Applied => self::Applied,
            RequestProgress::DeliveryUncertain => self::Uncertain,
            RequestProgress::Failed,
            RequestProgress::Unavailable,
            RequestProgress::Superseded,
            RequestProgress::Cancelled => self::Refused,
        };
    }
}
