<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Connections\ProjectEntryData;
use App\Enums\Projects\ProjectReadFailure;
use App\Enums\Projects\ProjectReadState;
use App\Models\Projects\ProjectRead;

/**
 * Where a read of a project's folder or file stands: waiting for its host, answered with entries or text, or failed
 * with the host's reason.
 */
final readonly class ProjectFileAnswer
{
    /**
     * @param  list<ProjectEntryData>  $entries
     */
    public function __construct(
        public string $readId,
        public string $path,
        public ProjectReadState $state,
        public ProjectReadFailure|null $failure,
        public array $entries,
        public string|null $text,
        public string|null $digest,
        public int|null $size,
        public bool $isTruncated,
    ) {}

    public static function of(ProjectRead $read): self
    {
        return new self(
            $read->id,
            $read->path,
            $read->state,
            $read->failure,
            $read->listedEntries(),
            $read->text,
            $read->digest,
            $read->size,
            $read->is_truncated,
        );
    }
}
