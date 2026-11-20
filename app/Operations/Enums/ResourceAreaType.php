<?php

declare(strict_types=1);

namespace App\Operations\Enums;

use App\Operations\Exceptions\UnknownResourceArea;

/**
 * Where an operation acts: the helper's workspace and scratch, the journal's content, work and control records, the
 * provider connection, an internet destination, or the protected resources no policy may grant.
 */
enum ResourceAreaType: string
{
    case Workspace = 'workspace';
    case Scratch = 'scratch';
    case JournalContent = 'journal.content';
    case JournalWork = 'journal.work';
    case JournalControl = 'journal.control';
    case ProviderConnection = 'provider.connection';
    case Internet = 'internet';
    case Protected = 'protected';

    /**
     * @throws UnknownResourceArea
     */
    public static function fromKey(string $key): self
    {
        return self::tryFrom($key) ?? throw UnknownResourceArea::forKey($key);
    }

    /**
     * Whether this area holds the files of the helper's own checkout, which a read-only helper never changes.
     */
    public function hasWorkspaceFiles(): bool
    {
        return $this === self::Workspace || $this === self::Scratch;
    }
}
