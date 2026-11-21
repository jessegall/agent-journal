<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Agents\Models\AgentSession;
use App\Agents\Values\AccessPolicy;

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

    /**
     * Decided from the start's access declaration and whether the session is a helper of another, never from the
     * profile's name.
     */
    public static function of(AccessPolicy $access, AgentSession $session): self
    {
        if (! $access->changesFiles()) {
            return self::ReadOnly;
        }

        return $session->parent_session_id === null ? self::Shared : self::OwnCheckout;
    }

    public function isWritable(): bool
    {
        return $this !== self::ReadOnly;
    }

    public function isOwnCheckout(): bool
    {
        return $this === self::OwnCheckout;
    }
}
