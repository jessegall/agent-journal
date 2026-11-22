<?php

declare(strict_types=1);

namespace App\Profiles\Models\Support;

use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Values\CleanupProgress;

/**
 * A row whose folder a host cleans in tries: it keeps the proof that the driver's store is gone, counts the tries
 * that left something behind with what was left, and waits for the owner's Retry once the tries run out. A folder a
 * running session still uses is no try: it is cleaned once the session is gone.
 */
trait KeepsCleanupTries
{
    /**
     * Records one try the host reported and answers whether it finished the cleanup: the store's proof is kept even
     * when the folder is still there, and an unfinished try counts and names what is left.
     */
    protected function recordCleanupTry(CleanupProgress $progress): bool
    {
        if ($progress->isStillBound) {
            $this->cleanup_problem = CleanupProblem::StillBound;

            return false;
        }

        $this->store_removed = $this->store_removed || $progress->isStoreRemoved;

        if ($this->store_removed && $progress->isDirectoryRemoved) {
            $this->cleanup_problem = null;

            return true;
        }

        $this->cleanup_tries++;
        $this->cleanup_problem = CleanupProblem::of($this->store_removed);

        return false;
    }

    protected function resetCleanupTries(): void
    {
        $this->cleanup_tries = 0;
        $this->save();
    }

    protected function hasUsedEveryCleanupTry(): bool
    {
        return $this->cleanup_tries >= CleanupProgress::MOST_TRIES;
    }
}
