<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use JsonSerializable;

/**
 * A screen the host must never send: one that asks for a secret, known by enough of its keywords appearing on it in
 * any case. The host shields such a frame before it leaves, so neither the journal nor a recording sees its rows.
 */
final readonly class ShieldRule implements JsonSerializable
{
    /**
     * @param  list<string>  $keywords
     */
    public function __construct(public array $keywords, public int $fewestKeywords) {}

    /**
     * @return array{keywords: list<string>, min_keywords: int}
     */
    public function jsonSerialize(): array
    {
        return [
            'keywords' => $this->keywords,
            'min_keywords' => $this->fewestKeywords,
        ];
    }
}
