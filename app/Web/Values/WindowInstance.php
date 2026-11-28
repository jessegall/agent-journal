<?php

declare(strict_types=1);

namespace App\Web\Values;

use App\Web\Creation\Exceptions\InvalidSurfaceInput;

final readonly class WindowInstance
{
    private function __construct(public string $declaration, public string|null $copyId) {}

    public static function original(string $declaration): self
    {
        return new self($declaration, null);
    }

    public static function copy(string $declaration, string $copyId): self
    {
        if (preg_match('/\A[a-f0-9]{12}\z/', $copyId) !== 1) {
            throw InvalidSurfaceInput::copy($copyId);
        }

        return new self($declaration, $copyId);
    }

    public function name(): string
    {
        return $this->copyId === null ? $this->declaration : "{$this->declaration}~{$this->copyId}";
    }

    public function prop(string $base): string
    {
        return $this->copyId === null ? $base : "{$base}__{$this->copyId}";
    }
}
