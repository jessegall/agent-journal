<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;

/**
 * The refusal a reply line of the protected host carries in place of its answer.
 */
final class HostRefusalData extends Data
{
    public function __construct(public readonly string $refusal) {}
}
