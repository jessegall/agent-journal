<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Data\MessageView;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads one message.
 *
 * @implements JournalCall<MessageView>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/show', 'POST', MessageView::class, CallEffect::Read)]
final class ShowMessageCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
    ) {}
}
