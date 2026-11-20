<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Records\Support\RecordIdentity;

/**
 * The work a dispatch hands a helper: what it is for (one of a subject, an existing purpose or a purpose in words),
 * the brief, the records it is given as its source, written as type:id, and whether it must be independent of
 * everything the helper saw. The brief is data and is never put into shell text.
 */
final readonly class HelperWork
{
    /**
     * @param  list<string>  $sourceSubjects
     */
    public function __construct(
        public RecordIdentity|null $subject,
        public string|null $purposeId,
        public string|null $purposeText,
        public string $brief,
        public array $sourceSubjects,
        public bool $independent,
    ) {}

    /**
     * @return array{subjects: list<string>}
     */
    public function sourceSnapshot(): array
    {
        return ['subjects' => $this->sourceSubjects];
    }

    /**
     * @return list<string|bool|null|list<string>>
     */
    public function fingerprint(): array
    {
        return [
            $this->subject?->type,
            $this->subject?->id,
            $this->purposeId,
            $this->purposeText,
            $this->brief,
            $this->sourceSubjects,
            $this->independent,
        ];
    }
}
