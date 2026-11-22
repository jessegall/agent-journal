<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Contracts\Authorization\WorkspacePolicy;
use Domain\Documents\Models\Document;

/**
 * Who may act on Document records; the grant decides, and the handlers keep their own checks.
 */
final readonly class DocumentPolicy implements WorkspacePolicy
{
    public static function model(): string
    {
        return Document::class;
    }
}
