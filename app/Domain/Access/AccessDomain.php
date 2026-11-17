<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Domain\Access\Api\Viewer;
use App\Domain\Access\Contracts\JournalAccessPolicy;
use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Contracts\Domain;

final class AccessDomain implements Domain
{
    public function description(): string
    {
        return 'The users who sign in, how they sign in, and which of them may use the journal.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            ViewerReader::class,
            JournalAccessPolicy::class,
            Viewer::class,
        ];
    }
}
