<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Events\SignInAttemptFinished;
use RuntimeException;

/**
 * A required listener that fails after the writer was released, so the transaction must roll both rows back.
 */
final readonly class FailsAfterRelease
{
    public function handle(SignInAttemptFinished $finished): void
    {
        throw new RuntimeException("The work after releasing {$finished->attemptId} failed.");
    }
}
