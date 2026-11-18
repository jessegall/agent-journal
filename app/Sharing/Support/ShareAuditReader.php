<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;

/**
 * A share's audit for its owner, a page at a time newest first: what happened, when, why and who it shows as having
 * acted, with the totals pruning kept. It holds no content, token or address.
 */
final readonly class ShareAuditReader
{
    private const int ROWS = 50;

    public function page(Share $share, string|null $after): ShareAuditPage
    {
        $found = ShareAudit::pageOf($share, $after, self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);
        $last = $rows === [] ? null : $rows[array_key_last($rows)];

        return new ShareAuditPage(
            array_map(fn (ShareAudit $audit) => $audit->entry(), $rows),
            count($found) > self::ROWS && $last !== null ? $last->id : null,
            $share->pruned_allowed_reads,
            $share->pruned_denied_reads,
            $share->pruned_lifecycle_rows,
            $share->last_pruned_at,
        );
    }
}
