<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Actors\Contracts\Policy;
use Domain\Documents\Models\Document;

/**
 * Who may recover drafts and change records another actor created: only the owner holds the access, so the grants
 * decide.
 */
final readonly class DocumentAdministrationPolicy implements Policy
{
    public static function model(): string
    {
        return Document::class;
    }
}
