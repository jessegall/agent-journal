<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Models\CertifiedWork;
use App\Agents\Models\StartRecord;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Models\StopAttempt;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Certifies the work of a session complete by a stop attempt whose final checks passed, once: the certificate is
 * recorded for the start that owns the work and the owner hears of it.
 */
final readonly class StopCertification
{
    public function __construct(private Dispatcher $events) {}

    public function certify(StopAttempt $attempt): void
    {
        if ($attempt->isCertified()) {
            return;
        }

        $attempt->certify();

        StartRecord::ownerStartOf($attempt->session_id)->forAll(function (StartRecord $start) use ($attempt): void {
            CertifiedWork::record($start, $attempt->id);
            $this->events->dispatch(new HelperCompletionCertified($start->ownerWork(), $attempt->reference()));
        });
    }
}
