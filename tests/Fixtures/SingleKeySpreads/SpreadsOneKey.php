<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleKeySpreads;

/**
 * Spreads of methods that give one fixed key, which the scan lists, beside a spread of several keys it leaves alone.
 */
final class SpreadsOneKey
{
    public function page(bool $isWide): array
    {
        return [
            ...$this->title(),
            ...$this->width($wide),
            ...$this->size(),
        ];
    }

    private function title(): array
    {
        return ['title' => 'Home'];
    }

    private function width(bool $isWide): array
    {
        $width = [];

        if ($wide) {
            $width['width'] = 'wide';
        }

        return $width;
    }

    private function size(): array
    {
        return [
            'width' => 1,
            'height' => 2,
        ];
    }
}
