<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

final readonly class PromptDetails
{
    public function __construct(
        public string $promptId,
        public string $text,
    ) {}
}
