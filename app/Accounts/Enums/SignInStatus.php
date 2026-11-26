<?php

declare(strict_types=1);

namespace App\Accounts\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where one sign-in attempt stands, from starting the driver's own sign-in to its end.
 */
#[TypeScript]
enum SignInStatus: string
{
    case Starting = 'starting';
    case Waiting = 'waiting';
    case Checking = 'checking';
    case Complete = 'complete';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Interrupted = 'interrupted';
    case DifferentAccount = 'different_account';
    case AlreadyAdded = 'already_added';
    case Unverified = 'unverified';

    /**
     * The states of an attempt whose sign-in process may still write the account's directory.
     *
     * @return list<self>
     */
    public static function live(): array
    {
        return [
            self::Starting,
            self::Waiting,
            self::Checking,
        ];
    }

    public function isLive(): bool
    {
        return in_array($this, self::live(), true);
    }

    /**
     * Whether the attempt still waits for the user to sign in: its process starts or shows the sign-in page.
     */
    public function isAwaitingSignIn(): bool
    {
        return $this === self::Starting || $this === self::Waiting;
    }

    public function canComplete(): bool
    {
        return $this === self::Waiting || $this === self::Checking;
    }
}
