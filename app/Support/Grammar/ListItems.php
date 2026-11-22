<?php

declare(strict_types=1);

namespace App\Support\Grammar;

/**
 * A list part-way through: its reading, and whether a ; may follow the item read last.
 */
final readonly class ListItems
{
    public function __construct(public ListToParse $toParse, public bool $mayTakeSemicolon) {}
}
