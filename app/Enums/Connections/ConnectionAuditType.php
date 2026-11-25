<?php

declare(strict_types=1);

namespace App\Enums\Connections;

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
    case DeviceApproved = 'device_approved';
    case DeviceRevoked = 'device_revoked';

    /**
     * The step as the owner reads it in a folder's support record.
     */
    public function label(): string
    {
        return match ($this) {
            self::Issued => 'Install line issued',
            self::Replaced => 'Install line replaced',
            self::InvitationRevoked => 'Install line revoked',
            self::Redeemed => 'Folder connected',
            self::Recovered => 'Connection recovered',
            self::BindingRevoked => 'Connection revoked',
            self::DeviceApproved => 'Terminal sign-in approved',
            self::DeviceRevoked => 'Terminal sign-in revoked',
        };
    }
}
