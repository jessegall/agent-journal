<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * The journal's answer to a relay of any protocol: the journal-agent release it publishes, none while it publishes
 * none, and every protocol version it speaks, so a relay on another one can name both.
 */
final class ReleaseCompatibilityData extends Data
{
    /**
     * @param  list<int>  $protocolVersions
     */
    public function __construct(
        public readonly string|null $release,
        public readonly array $protocolVersions,
    ) {}
}
