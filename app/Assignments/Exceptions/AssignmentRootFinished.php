<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Records\Support\RecordIdentity;
use RuntimeException;

final class AssignmentRootFinished extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(RecordIdentity $root): self
    {
        return new self("{$root->type} {$root->id} is finished, so its work is not given out as a whole; assign single records instead.");
    }

    protected function status(): int
    {
        return 422;
    }
}
