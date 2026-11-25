<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;

/**
 * A share's audit for its owner, a page at a time newest first: what happened, when, why and who it shows as having
 * acted, with the totals pruning kept. It holds no content, token or address.
 */
final readonly class ShareAuditResolver
{
    private const int ROWS = 50;

    public function page(Share $share, string|null $after): ShareAuditPage
    {
        $found = ShareAudit::pageOf($share, $after, self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);
        $last = $rows === [] ? null : $rows[array_key_last($rows)];

        $auditEntries = array_map(fn (ShareAudit $audit) => $audit->entry, $rows);
        $nextAfter = count($found) > self::ROWS && $last !== null ? $last->id : null;

        return ShareAuditPage::of($share, $auditEntries, $nextAfter);
    }
}
