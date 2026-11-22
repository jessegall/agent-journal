<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

/**
 * A menu a domain owns and exports, keyed within that domain, which items of any domain may join by its full key: a
 * record's menu names the route parameter its record fills, so every item binds to the record it is opened on.
 */
final readonly class Menu
{
    /**
     * @param  string|null  $recordParameter  the route parameter the record fills, or null for a menu of no record
     */
    private function __construct(public string $key, public string $label, public string|null $recordParameter) {}

    /**
     * A menu opened on one record, such as a document's actions, whose items take its number as the parameter named.
     */
    public static function record(string $key, string $label, string $parameter): self
    {
        return new self($key, $label, $parameter);
    }

    /**
     * A menu of no particular record, whose items take no route values.
     */
    public static function general(string $key, string $label): self
    {
        return new self($key, $label, null);
    }
}
