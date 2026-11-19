<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\SessionStartSource;

final readonly class SessionStartDetails
{
    public function __construct(
        public string $vendorSessionId,
        public SessionStartSource $source,
        public string|null $transcriptPath,
    ) {}
}
