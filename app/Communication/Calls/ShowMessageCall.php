<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Communication\Data\MessageView;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads one message.
 *
 * @implements JournalCall<MessageView>
 */
#[Endpoint('communication/show', 'POST', MessageView::class, CallEffect::Read)]
#[MapName(SnakeCaseMapper::class)]
final class ShowMessageCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
    ) {}
}
