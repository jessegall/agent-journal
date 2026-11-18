<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A fixture refusal carrying an MCP code.
 */
final class FixtureRecordUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(int $number): self
    {
        return new self("Record {$number} is not available.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
