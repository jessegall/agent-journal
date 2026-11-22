<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * How a start's account signs in to its provider: the driver's own subscription login (a claude.ai account for
 * Claude Code, a managed ChatGPT sign-in for Codex), kept in a host account folder.
 */
enum AccountModeType: string
{
    case Subscription = 'subscription';
}
