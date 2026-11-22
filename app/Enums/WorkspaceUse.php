<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How a session's container has the workspace at /workspace (doc 61, decision 6): read-only when its access grants
 * no change of workspace files; the environment's own workspace, read-write, for the main agent; and for a helper
 * that writes, its own clone, so its commits stay there until the merger takes them.
 */
enum WorkspaceUse: string
{
    case ReadOnly = 'read-only';
    case Shared = 'shared';
    case OwnCheckout = 'own-checkout';

    public function isWritable(): bool
    {
        return $this !== self::ReadOnly;
    }

    public function isOwnCheckout(): bool
    {
        return $this === self::OwnCheckout;
    }
}
