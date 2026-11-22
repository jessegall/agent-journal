<?php

declare(strict_types=1);

namespace App\Enums;

use App\Support\StartRemedy;

/**
 * Why no account could start a start of a driver, safe to tell the agent that asked.
 * It stays apart from AccountNoticeReason on purpose: an agent may learn only these, never a rejected sign-in
 * or a provider limit, which only the owner's account notices carry.
 */
enum StartUnavailableReason: string
{
    case NoAccount = 'no-account';
    case NeedsSignIn = 'needs-sign-in';
    case Maintenance = 'maintenance';
    case ChosenAccountMissing = 'chosen-account-missing';
    case ChosenAccountChanged = 'chosen-account-changed';

    public function sentence(): string
    {
        return match ($this) {
            self::NoAccount => 'no default account is chosen for it; choose one in Accounts',
            self::NeedsSignIn => 'its account needs to sign in again',
            self::Maintenance => 'its account is being signed in again or removed',
            self::ChosenAccountMissing => 'the chosen account is not one you can start it with',
            self::ChosenAccountChanged => 'the chosen account changed since you reviewed it; review it again',
        };
    }

    /**
     * The public explanation of a start no account could run.
     */
    public function explanation(): string
    {
        return match ($this) {
            self::NoAccount => 'No account is chosen for this driver.',
            self::NeedsSignIn => 'This account needs to sign in again.',
            self::Maintenance => 'This account is being signed in again or removed.',
            self::ChosenAccountMissing => 'The chosen account is unavailable.',
            self::ChosenAccountChanged => 'The chosen account changed since you reviewed it.',
        };
    }

    public function remedy(): StartRemedy
    {
        return match ($this) {
            self::NoAccount => StartRemedy::forEveryone(StartRemedyType::ChooseAccount, 'Choose an account'),
            self::NeedsSignIn => StartRemedy::forEveryone(StartRemedyType::ChooseAccount, 'Sign in'),
            self::Maintenance => StartRemedy::forEveryone(StartRemedyType::RetryStart, 'Retry start when eligible'),
            self::ChosenAccountMissing => StartRemedy::forEveryone(
                StartRemedyType::ChooseAccount,
                'Choose another account',
            ),
            self::ChosenAccountChanged => StartRemedy::forEveryone(
                StartRemedyType::ChooseAccount,
                'Review the account',
            ),
        };
    }
}
