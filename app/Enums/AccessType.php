<?php

declare(strict_types=1);

namespace App\Enums;

use App\Exceptions\UnknownAccessType;

/**
 * A kind of access an operation needs and a policy grants, always on a resource area; an operation the journal
 * cannot classify has no access type and is never granted.
 */
enum AccessType: string
{
    case Read = 'read';
    case Search = 'search';
    case Create = 'create';
    case Edit = 'edit';
    case Delete = 'delete';
    case Execute = 'execute';
    case Test = 'test';
    case Build = 'build';
    case Network = 'network';
    case Publish = 'publish';
    case Delegate = 'delegate';
    case Admin = 'admin';

    /**
     * @throws UnknownAccessType
     */
    public static function fromKey(string $key): self
    {
        return self::tryFrom($key) ?? throw UnknownAccessType::forKey($key);
    }

    /**
     * Whether this access changes files or runs what changes them, which a read-only helper's workspace never allows.
     */
    public function changesFiles(): bool
    {
        return in_array($this, [
            self::Create,
            self::Edit,
            self::Delete,
            self::Test,
            self::Build,
        ], true);
    }

    /**
     * Which built-in agent profiles this access is for on an ordinary policy: journal work for anyone, running tests
     * and builds for a profile that may change its workspace, delegating and deleting for a coordinator, and
     * administration for the owner.
     */
    public function audience(): ProfileAudience
    {
        return match ($this) {
            self::Read, self::Search, self::Create, self::Edit,
            self::Execute, self::Network, self::Publish => ProfileAudience::Anyone,
            self::Test, self::Build => ProfileAudience::Writable,
            self::Delegate, self::Delete => ProfileAudience::Coordinator,
            self::Admin => ProfileAudience::Owner,
        };
    }
}
