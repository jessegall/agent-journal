<?php

declare(strict_types=1);

namespace App\Web\Values;

use App\Web\Creation\Exceptions\InvalidSurfaceInput;
use Illuminate\Http\Request;

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

    public function attachTo(Request $visit): void
    {
        $visit->attributes->set(self::class, $this);
    }

    public static function ofVisit(Request $visit): self|null
    {
        $window = $visit->attributes->get(self::class);

        if ($window instanceof self) {
            return $window;
        }

        return null;
    }

    public function name(): string
    {
        if ($this->copyId === null) {
            return $this->declaration;
        }

        return "{$this->declaration}~{$this->copyId}";
    }

    public function prop(string $base): string
    {
        if ($this->copyId === null) {
            return $base;
        }

        return "{$base}__{$this->copyId}";
    }
}
