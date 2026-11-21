<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * The refusal a reply line of the protected host may carry in place of its answer.
 */
final class HostRefusalData extends Data
{
    public function __construct(public readonly string|Optional $refusal = new Optional()) {}
}
