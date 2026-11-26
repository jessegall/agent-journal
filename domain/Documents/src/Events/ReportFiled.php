<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Attributes\Listeners\TransactionListenerConsent;
use App\Navigation\Contracts\ClientUpdate;
use App\Support\ActorReference;

/**
 * A report was filed. It carries ids and the number, never the text. Helpers ties it to the helper job it answers in
 * the filing's transaction; its listener is named as text so Documents does not depend on Helpers.
 */
#[TransactionListenerConsent]
final readonly class ReportFiled implements ClientUpdate, DocumentEvent
{
    public function __construct(
        public string $reportId,
        public int $number,
        public ActorReference $actor,
    ) {}
}
