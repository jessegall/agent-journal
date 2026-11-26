<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A settings change made against an older revision than the stored one: read again and decide whether to retry.
 */
final class SettingsConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $owner, string $key, int $expectedRevision, int $currentRevision): self
    {
        return new self(
            sprintf(
                'The settings of %s changed since revision %s; they are at revision %s now, so %s was not changed.',
                $owner,
                $expectedRevision,
                $currentRevision,
                $key,
            ),
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
