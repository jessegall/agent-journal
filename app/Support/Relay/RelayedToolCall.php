<?php

declare(strict_types=1);

namespace App\Support\Relay;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The parts of a hook's tool call the relay judges without the journal: the tool, its arguments as the driver sent
 * them, and the folder its relative paths are read from, the file system root when the driver named none. A hook
 * that is no tool call, such as a Stop, names no tool.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class RelayedToolCall extends Data
{
    /**
     * @param  array<array-key, mixed>  $toolInput
     */
    public function __construct(
        public readonly array $toolInput = [],
        public readonly string $cwd = '/',
        public readonly string|null $toolName = null,
    ) {}

    /**
     * The file a read names, when its file_path argument is text.
     */
    public function readPath(): string|null
    {
        $path = $this->toolInput['file_path'] ?? null;

        return is_string($path) ? $path : null;
    }
}
