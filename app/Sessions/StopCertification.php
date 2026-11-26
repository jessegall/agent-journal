<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Bus\Contracts\CommandFacts;
use App\Events\Hooks\HelperCompletionCertified;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;

/**
 * Certifies the work of a session complete by a stop check whose final checks passed, once, and tells the owner of
 * the start that owns the work.
 */
final readonly class StopCertification
{
    public function __construct(private CommandFacts $facts) {}

    public function certify(StopCheck $attempt): void
    {
        if ($attempt->isCertified()) {
            return;
        }

        $attempt->certify();

        SessionRequest::findOwnerStartOf($attempt->session_id)->forAll(
            fn (SessionRequest $start) => $this->facts->publishAfterCommit(
                new HelperCompletionCertified($start->owner_work, $attempt->reference),
            ),
        );
    }
}
