<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Data;

/**
 * One exact command a revocation took away, as the revocation row keeps it: the executable and every word after it.
 */
final class RevokedPatternData extends Data
{
    /**
     * @param  list<string>  $words
     */
    public function __construct(public readonly array $words) {}
}
