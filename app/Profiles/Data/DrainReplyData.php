<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;

/**
 * The protected host's answer to a drain: whether it drained the account, taken as not when it does not say.
 */
final class DrainReplyData extends Data
{
    public function __construct(public readonly bool $drained = false) {}
}
