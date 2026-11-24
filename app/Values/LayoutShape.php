<?php

declare(strict_types=1);

namespace App\Values;

use App\Attributes\DecodesAnyJson;

/**
 * The shape of a saved layout, its grid and detached panels, as the page wrote it: the server keeps it as given and
 * never reads into it, so it travels as the page's JSON text.
 */
final readonly class LayoutShape
{
    public function __construct(public string $json) {}

    /**
     * @param  array<string, mixed>  $shape
     */
    public static function of(array $shape): self
    {
        return new self(json_encode($shape, JSON_THROW_ON_ERROR));
    }

    /**
     * @return array<string, mixed>
     */
    #[DecodesAnyJson]
    public function toArray(): array
    {
        $shape = json_decode($this->json, true, flags: JSON_THROW_ON_ERROR);

        if (is_array($shape)) {
            return $shape;
        }

        return [];
    }
}
