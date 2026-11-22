<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a read needs before its resolver runs: a policy grant, a named read the profile holds, or nothing beyond the
 * dedicated resolver that checks each record itself.
 */
enum ReadEntitlementType: string
{
    case Grant = 'grant';
    case Named = 'named';
    case Resolver = 'resolver';
}
