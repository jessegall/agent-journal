<?php

declare(strict_types=1);

namespace App\Values;

use App\Sessions\Enums\StopConditionResultType;

/**
 * What the host reports for one stop condition it ran: the condition and the definition it ran, how it ended, its
 * exit code or signal when the host knows them, a short summary and the raw output it kept. Times are ISO 8601
 * in UTC; an unknown exit code stays null, never a made-up zero.
 */
final readonly class StopConditionResultReport
{
    public const int SUMMARY_BYTES = 2048;

    public function __construct(
        public string $conditionKey,
        public string $definitionHash,
        public StopConditionResultType $status,
        public string $startedAt,
        public string|null $endedAt,
        public int|null $exitCode,
        public string|null $signal,
        public string $summary,
        public string|null $output,
        public bool $isTruncated,
    ) {}

    /**
     * The fields that make two submissions the same, in a fixed order.
     *
     * @return list<string|int|bool|null>
     */
    public function fingerprint(): array
    {
        return [
            $this->conditionKey,
            $this->definitionHash,
            $this->status->value,
            $this->startedAt,
            $this->endedAt,
            $this->exitCode,
            $this->signal,
            $this->summary,
            $this->output,
            $this->isTruncated,
        ];
    }
}
