<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\Policy;
use App\Models\CommandRules\CommandRequest;

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
