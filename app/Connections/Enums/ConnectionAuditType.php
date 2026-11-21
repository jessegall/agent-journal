<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * A step of connecting a project the audit keeps.
 */
enum ConnectionAuditType: string
{
    case Issued = 'issued';
    case Replaced = 'replaced';
    case InvitationRevoked = 'invitation_revoked';
    case Redeemed = 'redeemed';
    case Recovered = 'recovered';
    case BindingRevoked = 'binding_revoked';
}
