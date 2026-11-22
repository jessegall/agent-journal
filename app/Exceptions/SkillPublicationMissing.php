<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A publication id that names no publication.
 */
final class SkillPublicationMissing extends RuntimeException implements CodedRefusal
{
    public static function for(string $publicationId): self
    {
        return new self("No skill publication has the id {$publicationId}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
