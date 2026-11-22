<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads, for the message's author, whether each notified member's runtime accepted the wake.
 *
 * @implements JournalCall<WakeStatuses>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/wake-status', 'POST', WakeStatuses::class, CallEffect::Read)]
final class ReadWakeStatusCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
    ) {}
}
