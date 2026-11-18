<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What one executable part may do (doc 21 revision 6, section 6). A part can hold several classes, and none implies
 * another: edit never implies write. An unknown part has no class of its own; it carries an unresolved fact instead.
 */
enum CommandClass: string
{
    case Read = 'read';
    case Write = 'write';
    case Edit = 'edit';
    case Delete = 'delete';
    case Network = 'network';
    case ProcessControl = 'process_control';
    case PrivilegeChange = 'privilege_change';
    case VersionControl = 'version_control';
    case PackageInstall = 'package_install';
    case Verification = 'verification';
    case Build = 'build';
    case JournalOperation = 'journal_operation';

    /**
     * The class as a person reads it; verification is shown as Tests and checks.
     */
    public function label(): string
    {
        return match ($this) {
            self::Read => 'Read',
            self::Write => 'Write',
            self::Edit => 'Edit',
            self::Delete => 'Delete',
            self::Network => 'Network',
            self::ProcessControl => 'Process control',
            self::PrivilegeChange => 'Privilege change',
            self::VersionControl => 'Version control',
            self::PackageInstall => 'Package install',
            self::Verification => 'Tests and checks',
            self::Build => 'Build',
            self::JournalOperation => 'Journal operation',
        };
    }

    /**
     * Whether the class changes files on disk.
     */
    public function isFileChange(): bool
    {
        return in_array($this, [self::Write, self::Edit, self::Delete, self::PackageInstall], true);
    }
}
