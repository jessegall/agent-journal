<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Records\Support\RecordIdentity;
use RuntimeException;

final class AssignmentRootFinished extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(RecordIdentity $root): self
    {
        return new self(
            sprintf(
                '%s %s is finished, so its work is not given out as a whole; assign single records instead.',
                $root->type,
                $root->id,
            ),
        );
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
