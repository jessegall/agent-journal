<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Sharing\Support\ShareLinkedCandidate;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One linked record the owner may select in a preview: its title and published version, and whether the root's live
 * share already approves its link or it is not shared yet.
 */
#[TypeScript]
final class ShareCandidateData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
        public readonly string $title,
        public readonly string $publicationVersion,
        public readonly bool $shared,
    ) {}

    /**
     * @param  list<string>  $approvedLinkIds
     */
    public static function fromCandidate(ShareLinkedCandidate $candidate, array $approvedLinkIds): self
    {
        return new self($candidate->card->record->type, $candidate->card->record->id, $candidate->card->title, $candidate->card->publicationVersion, in_array($candidate->linkId, $approvedLinkIds, true));
    }
}
