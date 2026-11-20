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
     * The work as a call or a command line describes it, with its subject written as type:id.
     *
     * @param  list<string>  $sourceSubjects
     */
    public static function described(
        string|null $subject,
        string|null $purposeId,
        string|null $purposeText,
        string $brief,
        array $sourceSubjects,
        bool $independent,
    ): self {
        $subjectRecord = $subject === null ? null : new RecordIdentity(...explode(':', $subject, 2));

        return new self($subjectRecord, $purposeId, $purposeText, $brief, $sourceSubjects, $independent);
    }

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
