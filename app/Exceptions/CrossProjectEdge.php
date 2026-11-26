<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * Two records of different projects were to be joined, such as a link, an assignment or a wait.
 */
final class CrossProjectEdge extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    /**
     * The record named in words, such as task 12, belongs to another project than the one it joins.
     */
    public static function forRecord(string $record): self
    {
        return new self(ucfirst($record).' belongs to another project');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}
