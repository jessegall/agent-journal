<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Contracts\CallRefusal;
use App\AgentRequests\Exceptions\CallCancelled;
use App\AgentRequests\Exceptions\CallConflict;
use App\AgentRequests\Exceptions\CallKeyConflict;
use App\AgentRequests\Exceptions\CallKeyExpired;
use App\AgentRequests\Exceptions\CallRefused;
use App\AgentRequests\Exceptions\CallTooLarge;
use App\AgentRequests\Exceptions\ClientOutOfDate;
use App\AgentRequests\Exceptions\DeadlineExpired;
use App\AgentRequests\Exceptions\InputRefused;
use App\AgentRequests\Exceptions\JournalBusy;
use App\AgentRequests\Exceptions\JournalUnavailable;
use App\AgentRequests\Exceptions\NotAllowed;
use App\AgentRequests\Exceptions\NotAuthenticated;
use App\AgentRequests\Exceptions\OutcomeUnknown;
use App\AgentRequests\Exceptions\ProfilesUnavailable;
use App\AgentRequests\Exceptions\RecordNotFound;
use App\AgentRequests\Exceptions\StaleContinuation;
use App\AgentRequests\Exceptions\StateBlocked;
use App\Reflection\Support\Reflector;

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
            if (Reflector::isNameSubclassOf($refusal, CallRefusal::class)
                && Reflector::isNameSubclassOf($refusal, CallRefused::class)
                && $refusal::code() === $code) {
                return $refusal;
            }
        }

        return self::SHARED[$code] ?? JournalUnavailable::class;
    }
}
