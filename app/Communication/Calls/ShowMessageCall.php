<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Communication\Data\MessageView;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Reads one message.
 *
 * @implements JournalCall<MessageView>
 */
#[Endpoint('communication/show', 'POST', MessageView::class, CallEffect::Read)]
final class ShowMessageCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
    ) {}
}
