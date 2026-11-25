<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Refusals\CallRefusal;
use App\Exceptions\CallCancelled;
use App\Exceptions\CallConflict;
use App\Exceptions\CallKeyConflict;
use App\Exceptions\CallKeyExpired;
use App\Exceptions\CallRefused;
use App\Exceptions\CallTooLarge;
use App\Exceptions\ClientOutOfDate;
use App\Exceptions\DeadlineExpired;
use App\Exceptions\InputRefused;
use App\Exceptions\JournalBusy;
use App\Exceptions\JournalUnavailable;
use App\Exceptions\NotAllowed;
use App\Exceptions\NotAuthenticated;
use App\Exceptions\OutcomeUnknown;
use App\Exceptions\ProfilesUnavailable;
use App\Exceptions\RecordNotFound;
use App\Exceptions\StaleContinuation;
use App\Exceptions\StateBlocked;

/**
 * Picks the exception a refusal code is thrown as: the call's own declared refusal of that code first, then the shared
 * class of the code, else the journal being unavailable.
 */
final class RefusalExceptions
{
    /**
     * The shared refusal class of each code.
     *
     * @var array<string, class-string<CallRefused>>
     */
    private const array SHARED = [
        'invalid_input' => InputRefused::class,
        'unauthenticated' => NotAuthenticated::class,
        'forbidden' => NotAllowed::class,
        'record_unavailable' => RecordNotFound::class,
        'state_blocked' => StateBlocked::class,
        'conflict' => CallConflict::class,
        'request_key_conflict' => CallKeyConflict::class,
        'request_key_expired' => CallKeyExpired::class,
        'stale_continuation' => StaleContinuation::class,
        'busy' => JournalBusy::class,
        'unavailable' => JournalUnavailable::class,
        'cancelled' => CallCancelled::class,
        'unsupported_version' => ClientOutOfDate::class,
        'profiles_unavailable' => ProfilesUnavailable::class,
        'too_large' => CallTooLarge::class,
        'deadline_expired' => DeadlineExpired::class,
        'outcome_unknown' => OutcomeUnknown::class,
    ];

    /**
     * @param  list<class-string>  $declared  the refusals the call's endpoint declares
     * @return class-string<CallRefused>
     */
    public static function classOf(string $code, array $declared): string
    {
        foreach ($declared as $refusal) {
            if (ReflectedType::factory()->isSubclassOf($refusal, CallRefusal::class)
                && ReflectedType::factory()->isSubclassOf($refusal, CallRefused::class)
                && $refusal::code() === $code) {
                return $refusal;
            }
        }

        return self::SHARED[$code] ?? JournalUnavailable::class;
    }
}
