<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where an accepted driver request stands (doc 40, section 14); its outcome is a separate fact.
 */
#[TypeScript]
enum RequestProgress: string
{
    case Accepted = 'accepted';
    case Staged = 'staged';
    case Applying = 'applying';
    case Applied = 'applied';
    case Superseded = 'superseded';
    case Cancelled = 'cancelled';
    case Failed = 'failed';
    case Unavailable = 'unavailable';
    case DeliveryUncertain = 'delivery_uncertain';

    /**
     * Whether nothing more happens to a request in this progress.
     */
    public function isFinal(): bool
    {
        return match ($this) {
            self::Accepted, self::Staged, self::Applying => false,
            self::Applied, self::Superseded, self::Cancelled, self::Failed, self::Unavailable, self::DeliveryUncertain => true,
        };
    }
}
