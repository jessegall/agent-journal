<?php

declare(strict_types=1);

namespace App\Agents\Inputs\Values;

use App\Files\Enums\FileOperation;
use App\Values\Operation;
use App\Values\ResourceRequest;

final readonly class FileChange
{
    public const string SURFACE = 'file';

    public const int DECLARATION_REVISION = 1;

    public function __construct(
        public string $path,
        public FileOperation $operation,
    ) {}

    /**
     * The change as the operation an access policy decides: its file operation on its workspace path.
     */
    public function asOperation(): Operation
    {
        return new Operation(
            self::SURFACE,
            sprintf('file:%s', $this->operation->value),
            $this->operation->accessTypes(),
            [ResourceRequest::path($this->path)],
            [$this->path],
            self::DECLARATION_REVISION,
        );
    }
}
