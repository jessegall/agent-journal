<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\SubmissionKeyReused;
use App\Communication\Models\Message;

/**
 * Finds the message a sender already stored under a submission key: the same message sent again answers with its id,
 * a different message under the key is refused. Handlers ask before they insert, and again when an insert loses a race.
 */
final readonly class SubmissionReplay
{
    /**
     * @throws SubmissionKeyReused
     */
    public function earlier(ActorIdentity $sender, Submission $submission): string|null
    {
        $stored = Message::submittedBy($sender, $submission->key);
        if ($stored === null) {
            return null;
        }
        if ($stored->submission_hash !== $submission->hash) {
            throw SubmissionKeyReused::forKey($submission->key);
        }

        return $stored->id;
    }
}
