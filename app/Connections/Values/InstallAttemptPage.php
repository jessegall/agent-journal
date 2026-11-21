<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One page of the owner's install attempts, newest first, and the cursor of the next page, none on the last.
 */
final readonly class InstallAttemptPage
{
    /**
     * @param  list<InstallAttemptRow>  $rows
     */
    public function __construct(public array $rows, public string|null $nextCursor) {}
}
