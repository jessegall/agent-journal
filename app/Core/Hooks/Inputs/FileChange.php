<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

final readonly class FileChange
{
    public function __construct(
        public string $path,
        public FileOperation $operation,
    ) {}
}
