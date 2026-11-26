<?php

declare(strict_types=1);

namespace App\Api;

use App\Api\Exceptions\ApiCancelled;
use App\Api\Exceptions\ApiConflict;
use App\Api\Exceptions\ApiTooLarge;
use App\Api\Exceptions\CallKeyConflict;
use App\Api\Exceptions\CallKeyExpired;
use App\Api\Exceptions\ClientOutOfDate;
use App\Api\Exceptions\DeadlineExpired;
use App\Api\Exceptions\InputRefused;
use App\Api\Exceptions\JournalBusy;
use App\Api\Exceptions\JournalUnavailable;
use App\Api\Exceptions\NotAllowed;
use App\Api\Exceptions\NotAuthenticated;
use App\Api\Exceptions\OutcomeUnknown;
use App\Api\Exceptions\ProfilesUnavailable;
use App\Api\Exceptions\RecordNotFound;
use App\Api\Exceptions\StaleContinuation;
use App\Contracts\Refusals\ApiRefusal;
use App\Exceptions\ApiRefused;
use App\Exceptions\StateBlocked;
use App\Support\Reflector;

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
            if (Reflector::factory()->isSubclassOf($refusal, ApiRefusal::class)
                && Reflector::factory()->isSubclassOf($refusal, ApiRefused::class)
                && $refusal::code() === $code) {
                return $refusal;
            }
        }

        return self::SHARED[$code] ?? JournalUnavailable::class;
    }
}
