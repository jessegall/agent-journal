<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\ContextStartType;

final readonly class SessionStartDetails
{
    public function __construct(
        public string $vendorSessionId,
        public ContextStartType $source,
        public string|null $transcriptPath,
    ) {}
}
