<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Refusals\ApiRefusal;
use App\Exceptions\ApiCancelled;
use App\Exceptions\ApiConflict;
use App\Exceptions\ApiRefused;
use App\Exceptions\ApiTooLarge;
use App\Exceptions\CallKeyConflict;
use App\Exceptions\CallKeyExpired;
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
     * @var array<string, class-string<ApiRefused>>
     */
    private const array SHARED = [
        'invalid_input' => InputRefused::class,
        'unauthenticated' => NotAuthenticated::class,
        'forbidden' => NotAllowed::class,
        'record_unavailable' => RecordNotFound::class,
        'state_blocked' => StateBlocked::class,
        'conflict' => ApiConflict::class,
        'request_key_conflict' => CallKeyConflict::class,
        'request_key_expired' => CallKeyExpired::class,
        'stale_continuation' => StaleContinuation::class,
        'busy' => JournalBusy::class,
        'unavailable' => JournalUnavailable::class,
        'cancelled' => ApiCancelled::class,
        'unsupported_version' => ClientOutOfDate::class,
        'profiles_unavailable' => ProfilesUnavailable::class,
        'too_large' => ApiTooLarge::class,
        'deadline_expired' => DeadlineExpired::class,
        'outcome_unknown' => OutcomeUnknown::class,
    ];

    /**
     * @param  list<class-string>  $declared  the refusals the call's endpoint declares
     * @return class-string<ApiRefused>
     */
    public static function classOf(string $code, array $declared): string
    {
        foreach ($declared as $refusal) {
            if (ReflectedType::factory()->isSubclassOf($refusal, ApiRefusal::class)
                && ReflectedType::factory()->isSubclassOf($refusal, ApiRefused::class)
                && $refusal::code() === $code) {
                return $refusal;
            }
        }

        return self::SHARED[$code] ?? JournalUnavailable::class;
    }
}
