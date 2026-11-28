<?php

declare(strict_types=1);

namespace App\Support;

/**
 * @template T
 */
final readonly class CursorPage
{
    /**
     * @param  list<T>  $items
     */
    public function __construct(public array $items, public string|null $nextAfterId) {}
}
