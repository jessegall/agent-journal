<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ReadPermitMissing;

/**
 * What a valid share token allows within one request: reading the share at its scope version, named by a random
 * reference the read command carries instead of the token. It lives in the request only.
 */
final readonly class ReadPermit
{
    public function __construct(
        public string $shareId,
        public int $scopeVersion,
        public string $reference,
    ) {}

    /**
     * @return array<string, mixed>
     *
     * @throws ReadPermitMissing
     */
    public function __serialize(): array
    {
        throw ReadPermitMissing::serialized();
    }
}
