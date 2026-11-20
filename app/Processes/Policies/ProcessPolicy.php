<?php

declare(strict_types=1);

namespace App\Processes\Policies;

use App\Actors\Contracts\Policy;
use App\Processes\Models\CommandRequest;

/**
 * Who may act on CommandRequest records; the grant decides, and the handlers keep their own checks.
 */
final readonly class ProcessPolicy implements Policy
{
    public static function model(): string
    {
        return CommandRequest::class;
    }
}
