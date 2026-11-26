<?php

declare(strict_types=1);

namespace App\Agents\Inputs\Values;

final readonly class PromptDetails
{
    public function __construct(
        public string $promptId,
        public string $text,
        public string|null $nativePromptId,
    ) {}
}
