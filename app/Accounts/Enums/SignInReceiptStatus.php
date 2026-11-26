<?php

declare(strict_types=1);

namespace App\Accounts\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the owner's request key of a sign-in start says: it started or rejoined an attempt, was refused, is still being
 * written, no longer answers, or names no start the owner made.
 */
#[TypeScript]
enum SignInReceiptStatus: string
{
    case Started = 'started';
    case Refused = 'refused';
    case Pending = 'pending';
    case Expired = 'expired';
    case Unknown = 'unknown';
}
