<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Enums\FileOperation;

final readonly class FileChange
{
    public function __construct(
        public string $path,
        public FileOperation $operation,
    ) {}
}
