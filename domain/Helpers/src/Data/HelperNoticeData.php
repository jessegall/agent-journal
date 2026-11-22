<?php

declare(strict_types=1);

namespace Domain\Helpers\Data;

use Domain\Helpers\Models\HelperNotice;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One notice a parent was left about its helper's job.
 */
#[MapName(SnakeCaseMapper::class)]
final class HelperNoticeData extends Data
{
    public function __construct(
        public string $id,
        public string $identityId,
        public string $jobId,
        public string $jobState,
        public string $text,
    ) {}

    public static function fromHelperNotice(HelperNotice $notice): self
    {
        return self::from([
            'id' => $notice->id,
            'identityId' => $notice->helper_identity_id,
            'jobId' => $notice->helper_job_id,
            'jobState' => $notice->job_state->value,
            'text' => $notice->text,
        ]);
    }
}
