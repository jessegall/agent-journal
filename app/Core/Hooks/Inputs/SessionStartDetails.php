<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

final readonly class SessionStartDetails
{
    public function __construct(
        public string $vendorSessionId,
        public SessionStartSource $source,
    ) {}
}
