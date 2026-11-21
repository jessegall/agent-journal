<?php

declare(strict_types=1);

namespace Domain\Helpers\Readers;

use App\Drivers\Enums\HookDriver;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Models\HelperPurpose;

/**
 * Which of the acting parent's helpers may take new work: the profile key and base the work needs, its purpose, the
 * chosen program and exact model, and whether the work must be independent of everything the helper saw before.
 */
final readonly class CandidateQuery
{
    public function __construct(
        public string $profileKey,
        public string $profileBase,
        public HelperPurpose $purpose,
        public HookDriver $driver,
        public string $model,
        public bool $independent,
    ) {}

    /**
     * The record the purpose is about, which an independent helper must never have seen; a free purpose has none.
     */
    public function subject(): RecordIdentity|null
    {
        return $this->purpose->subject_type === null || $this->purpose->subject_id === null
            ? null
            : new RecordIdentity($this->purpose->subject_type, $this->purpose->subject_id);
    }
}
