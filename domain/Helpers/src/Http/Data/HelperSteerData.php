<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Data;

use Domain\Helpers\Support\SteerReceipt;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a steer did: the live job it reached, or the kept message and the command that would carry it.
 */
#[MapName(SnakeCaseMapper::class)]
final class HelperSteerData extends Data
{
    public function __construct(
        public bool $reachedLiveJob,
        public string|null $jobId,
        public string|null $messageId,
        public string|null $suggestedCommand,
    ) {}

    public static function fromSteerReceipt(SteerReceipt $receipt): self
    {
        return self::from([
            'reachedLiveJob' => $receipt->jobId !== null,
            'jobId' => $receipt->jobId,
            'messageId' => $receipt->messageId,
            'suggestedCommand' => $receipt->suggestedCommand,
        ]);
    }
}
