<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Starts\HostRefusal;
use App\Enums\Starts\ResumeRefusal;
use App\Enums\Starts\StartPreflightRefusal;
use App\Enums\Starts\StartRefusalType;
use App\Enums\Starts\StartUnavailableReason;

/**
 * Reads a refusal code a start record kept back as its reason; a code no reason names reads as the host's unknown
 * refusal, never as a guess.
 */
final class StartRefusalCodes
{
    /**
     * @var list<class-string<StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason|HostRefusal>>
     */
    private const array REASONS = [
        StartRefusalType::class,
        StartPreflightRefusal::class,
        ResumeRefusal::class,
        StartUnavailableReason::class,
        HostRefusal::class,
    ];

    public static function reasonOf(
        string $code,
    ): StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason|HostRefusal {
        foreach (self::REASONS as $reasons) {
            $reason = $reasons::tryFrom($code);

            if ($reason !== null) {
                return $reason;
            }
        }

        return HostRefusal::Unknown;
    }
}
