<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sessions\ResumeRefusal;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Enums\Sessions\StartRefusalReason;
use App\Enums\Sessions\StartRefusalType;
use App\Enums\Sessions\StartUnavailableReason;

/**
 * Reads a refusal code a start record kept back as its reason; a code no reason names reads as the host's unknown
 * refusal, never as a guess.
 */
final class StartRefusalCodes
{
    /**
     * @var list<class-string<StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason|StartRefusalReason>>
     */
    private const array REASONS = [
        StartRefusalType::class,
        StartPreflightRefusal::class,
        ResumeRefusal::class,
        StartUnavailableReason::class,
        StartRefusalReason::class,
    ];

    public static function reasonOf(
        string $code,
    ): StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason|StartRefusalReason {
        foreach (self::REASONS as $reasons) {
            $reason = $reasons::tryFrom($code);

            if ($reason !== null) {
                return $reason;
            }
        }

        return StartRefusalReason::Unknown;
    }
}
