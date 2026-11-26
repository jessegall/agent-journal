<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Whether a driver can take a rewritten command without the journal granting a native approval.
 */
enum RewriteSupport: string
{
    case WithoutApproval = 'without_approval';
    case NeedsApproval = 'needs_approval';

    /**
     * Whether the driver runs a rewritten command line without asking anyone first.
     */
    public function canRewrite(): bool
    {
        return match ($this) {
            self::WithoutApproval => true,
            self::NeedsApproval => false,
        };
    }
}
