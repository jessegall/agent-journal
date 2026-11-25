<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ResourceType;
use Spatie\LaravelData\Data;

/**
 * One operand an operation acts on: a path relative to the working folder or absolute, a network destination, or a
 * journal record, in canonical form.
 */
final class ResourceRequest extends Data
{
    public function __construct(public readonly ResourceType $type, public readonly string $target) {}

    public static function path(string $path): self
    {
        return new self(ResourceType::Path, $path);
    }

    public static function destination(string $destination): self
    {
        return new self(ResourceType::Destination, $destination);
    }

    public static function record(string $record): self
    {
        return new self(ResourceType::Record, $record);
    }

    /**
     * The path with ./ prefixes, repeated and trailing slashes removed; the working folder itself is '.'.
     */
    public function normalizedPath(): string
    {
        $path = preg_replace('#/+#', '/', $this->target) ?? $this->target;
        $path = preg_replace('#^(\./)+#', '', $path) ?? $path;
        $path = rtrim($path, '/');

        return match (true) {
            $path !== '' => $path,
            $this->target === '' => '',
            default => '.',
        };
    }

    /**
     * Whether the operand cannot be judged: an empty target, or a path that escapes its root with '..'.
     */
    public function isUnknown(): bool
    {
        return trim($this->target) === ''
            || ($this->type === ResourceType::Path && preg_match('#(^|/)\.\.(/|$)#', $this->target) === 1);
    }
}
