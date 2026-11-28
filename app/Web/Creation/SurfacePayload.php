<?php

declare(strict_types=1);

namespace App\Web\Creation;

use Illuminate\Contracts\Support\Arrayable;

/** @implements Arrayable<string, mixed> */
final readonly class SurfacePayload implements Arrayable
{
    /** @param array<string, mixed> $fields */
    public function __construct(private SurfaceContext $context, private array $fields) {}

    public function context(): SurfaceContext
    {
        return $this->context;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return $this->fields;
    }
}
