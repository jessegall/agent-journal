<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Assignments\Support\RecordIdentity;
use RuntimeException;

final class AssignmentRootFinished extends RuntimeException
{
    public static function for(RecordIdentity $root): self
    {
        return new self("{$root->type} {$root->id} is finished, so its work is not given out as a whole; assign single records instead.");
    }
}
