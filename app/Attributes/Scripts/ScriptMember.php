<?php

declare(strict_types=1);

namespace App\Attributes\Scripts;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class ScriptMember
{
    /**
     * @param  string  $read  the read operation the member needs
     * @param  string  $name  the word a script names the member by
     */
    public function __construct(public string $read, public string $name) {}
}
