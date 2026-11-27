<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Protocol\HostProjectReadFailure;
use App\Hosts\Protocol\Payloads\HostProjectEntryPayload;
use App\Models\Projects\ProjectRead;
use App\Projects\Enums\ProjectReadStatus;

/**
 * Where a read of a project's folder or file stands: waiting for its host, answered with entries or text, or failed
 * with the host's reason.
 */
final readonly class ProjectFileAnswer
{
    /**
     * @param  list<HostProjectEntryPayload>  $entries
     */
    public function __construct(
        public string $readId,
        public string $path,
        public ProjectReadStatus $status,
        public HostProjectReadFailure|null $failure,
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
            $read->status,
            $read->failure,
            $read->listedEntries(),
            $read->text,
            $read->digest,
            $read->size,
            $read->is_truncated,
        );
    }
}
