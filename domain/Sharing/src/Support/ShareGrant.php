<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

/**
 * The owner's grant to share a root under a gateway configuration, named by its id and version, with a new token.
 */
final readonly class ShareGrant
{
    public function __construct(
        public string $ownerUserId,
        public string $configurationId,
        public int $configurationVersion,
        public ShareToken $token,
    ) {}
}
