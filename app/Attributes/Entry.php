<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Enums\Accounts\CommandEntry;
use Attribute;

/**
 * The trusted entry a Core command belongs to; a command without it is an application command.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Entry
{
    public function __construct(public CommandEntry $entry) {}
}
