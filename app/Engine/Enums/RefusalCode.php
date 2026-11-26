<?php

declare(strict_types=1);

namespace App\Engine\Enums;

use App\Contracts\Refusals\CodedRefusal;
use App\Exceptions\ActorNotAllowed;
use Throwable;

/**
 * The code an MCP caller reads from a refused call, to choose its recovery.
 */
enum RefusalCode: string
{
    case InvalidInput = 'invalid_input';
    case Unauthenticated = 'unauthenticated';
    case Forbidden = 'forbidden';
    case RecordUnavailable = 'record_unavailable';
    case StateBlocked = 'state_blocked';
    case Conflict = 'conflict';
    case RequestKeyConflict = 'request_key_conflict';
    case RequestKeyExpired = 'request_key_expired';
    case StaleContinuation = 'stale_continuation';
    case Busy = 'busy';
    case Unavailable = 'unavailable';
    case Cancelled = 'cancelled';
    case DeadlineExpired = 'deadline_expired';
    case OutcomeUnknown = 'outcome_unknown';
    case UnsupportedVersion = 'unsupported_version';
    case ProfilesUnavailable = 'profiles_unavailable';
    case AdmissionRefused = 'admission_refused';

    /**
     * The code of a refusal: its own when it carries one, forbidden for an actor its authorizer refused, which comes
     * from an area that cannot carry a code of its own, else blocked.
     */
    public static function of(Throwable $refusal): self
    {
        if ($refusal instanceof CodedRefusal) {
            return $refusal->refusalCode();
        }

        if ($refusal instanceof ActorNotAllowed) {
            return self::Forbidden;
        }

        return self::StateBlocked;
    }

    /**
     * The HTTP status a signed route answers the refusal with.
     */
    public function status(): int
    {
        return match ($this) {
            self::InvalidInput, self::AdmissionRefused => 422,
            self::Unauthenticated => 401,
            self::Forbidden => 403,
            self::RecordUnavailable => 404,
            self::StateBlocked, self::Conflict, self::RequestKeyConflict, self::RequestKeyExpired,
            self::StaleContinuation, self::Cancelled, self::OutcomeUnknown => 409,
            self::Busy => 429,
            self::Unavailable, self::DeadlineExpired, self::ProfilesUnavailable => 503,
            self::UnsupportedVersion => 426,
        };
    }

    /**
     * Whether the same call may succeed when it is sent again unchanged a little later.
     */
    public function isRetryable(): bool
    {
        return match ($this) {
            self::Busy, self::Unavailable, self::DeadlineExpired => true,
            self::InvalidInput, self::Unauthenticated, self::Forbidden, self::RecordUnavailable, self::StateBlocked,
            self::Conflict, self::RequestKeyConflict, self::RequestKeyExpired, self::StaleContinuation,
            self::Cancelled, self::OutcomeUnknown, self::UnsupportedVersion, self::ProfilesUnavailable,
            self::AdmissionRefused => false,
        };
    }

    /**
     * Whether only the calls that declare it answer this code, each with its own refusal class on the client.
     */
    public function belongsToItsCalls(): bool
    {
        return $this === self::AdmissionRefused;
    }
}
