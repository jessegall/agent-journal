<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * How a session's container has the workspace at /workspace: read-only when its access grants
 * no change of workspace files; the environment's own workspace, read-write, for the main agent; and for another agent
 * that writes, its own clone, so its commits stay there until they are merged.
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
