<?php

declare(strict_types=1);

namespace App\Sharing\Data;

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
        public readonly bool $isShared,
    ) {}

    /**
     * @param  list<string>  $approvedLinkIds
     */
    public static function fromCandidate(ShareLinkedCandidate $candidate, array $approvedLinkIds): self
    {
        $card = $candidate->card;

        return new self(
            $card->record->type,
            $card->record->id,
            $card->title,
            $card->publicationVersion,
            $candidate->isApprovedAmong($approvedLinkIds),
        );
    }
}
