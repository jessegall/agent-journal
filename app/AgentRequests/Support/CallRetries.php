<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\DeadlineExpired;
use App\AgentRequests\Exceptions\JournalBusy;
use App\AgentRequests\Exceptions\JournalUnavailable;
use App\AgentRequests\Exceptions\JournalUnreachable;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Sleep;

/**
 * Sends a read or a keyed write again after a failure that may pass: no answer, busy, unavailable or a deadline the
 * journal saw expire. At most three attempts, each of at most four seconds or the time left, with waits of 200 then
 * 400 ms, all within the call's deadline; a sequenced write is sent once, since its caller sends it again itself.
 */
final class CallRetries
{
    private const int MOST_ATTEMPTS = 3;

    private const int MOST_ATTEMPT_SECONDS = 4;

    private const array WAITS_MILLISECONDS = [200, 400];

    /**
     * @template TResult
     *
     * @param  Closure(CarbonImmutable): TResult  $attempt  takes the deadline of one attempt
     * @return TResult
     *
     * @throws CallDeadlinePassed
     */
    public static function within(
        CallEffect $effect,
        CarbonImmutable $deadline,
        string $callId,
        Closure $attempt,
    ): mixed {
        for ($number = 1; ; $number++) {
            try {
                return $attempt(self::attemptDeadline($deadline));
            } catch (JournalUnreachable|JournalBusy|JournalUnavailable|DeadlineExpired $failure) {
                $wait = self::WAITS_MILLISECONDS[$number - 1] ?? 0;
                $again = $effect->isRetriedByClient() && $number < self::MOST_ATTEMPTS;

                if (! $again) {
                    throw $failure;
                }

                if (CarbonImmutable::now()->addMilliseconds($wait)->greaterThanOrEqualTo($deadline)) {
                    throw CallDeadlinePassed::for($callId);
                }

                Sleep::for($wait)->milliseconds();
            }
        }
    }

    private static function attemptDeadline(CarbonImmutable $deadline): CarbonImmutable
    {
        $longest = CarbonImmutable::now()->addSeconds(self::MOST_ATTEMPT_SECONDS);

        return $longest->lessThan($deadline) ? $longest : $deadline;
    }
}
