<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why no account could start a start of a program, safe to tell the agent that asked.
 * It stays apart from AccountNoticeReason on purpose: an agent may learn only these three, never a rejected sign-in
 * or a provider limit, which only the owner's account notices carry.
 */
enum StartUnavailableReason: string
{
    case NoAccount = 'no-account';
    case NeedsSignIn = 'needs-sign-in';
    case Maintenance = 'maintenance';

    public function sentence(): string
    {
        return match ($this) {
            self::NoAccount => 'no account is signed in for it',
            self::NeedsSignIn => 'its account needs to sign in again',
            self::Maintenance => 'its account is being signed in again or removed',
        };
    }
}
