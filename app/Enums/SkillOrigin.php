<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a skill's text comes from: a PHP class shipped with Core, a domain or a module, or revisions users stored.
 */
enum SkillOrigin: string
{
    case Shipped = 'shipped';
    case Stored = 'stored';
}
