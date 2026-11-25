<?php

declare(strict_types=1);

namespace App\Enums\Sharing;

/**
 * Who an audit row shows as having acted, as the owner reads it: the owner, the requesting agent, the journal's own
 * system, or an unknown visitor for a public read. Never an address or an identity beyond that.
 */
enum ShareAuditActor: string
{
    case Owner = 'owner';
    case Agent = 'agent';
    case System = 'system';
    case Visitor = 'visitor';
}
