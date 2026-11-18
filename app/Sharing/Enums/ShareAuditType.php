<?php

declare(strict_types=1);

namespace App\Sharing\Enums;

/**
 * What one audit row of a share records: a step of its life, a public read allowed or denied, or a pruning.
 */
enum ShareAuditType: string
{
    case Created = 'created';
    case Approved = 'approved';
    case ScopeRefreshed = 'scope_refreshed';
    case Activated = 'activated';
    case ActivationFailed = 'activation_failed';
    case Retried = 'retried';
    case Revoked = 'revoked';
    case Expired = 'expired';
    case ReadAllowed = 'read_allowed';
    case ReadDenied = 'read_denied';
    case GatewayChanged = 'gateway_changed';
    case AuditPruned = 'audit_pruned';

    /**
     * Whether the row records one public read, kept 30 days, rather than a step of the share's life, kept a year.
     */
    public function isRead(): bool
    {
        return match ($this) {
            self::ReadAllowed, self::ReadDenied => true,
            self::Created, self::Approved, self::ScopeRefreshed, self::Activated, self::ActivationFailed, self::Retried,
            self::Revoked, self::Expired, self::GatewayChanged, self::AuditPruned => false,
        };
    }

    /**
     * The types that record one public read.
     *
     * @return list<self>
     */
    public static function readTypes(): array
    {
        return array_values(array_filter(self::cases(), fn (self $type) => $type->isRead()));
    }
}
