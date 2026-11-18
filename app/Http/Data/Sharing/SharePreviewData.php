<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's preview page of sharing one root, named as people name it: its latest published title, the linked candidates to select
 * from, the last saved preview when one is still open, and the root's live share and open proposals, which a confirmed
 * preview refreshes or approves.
 */
#[TypeScript]
final class SharePreviewData extends Data
{
    /**
     * @param  list<ShareCandidateData>  $candidates
     * @param  list<RootShareData>  $openProposals
     */
    public function __construct(
        public readonly string $rootReference,
        public readonly string $rootTitle,
        #[DataCollectionOf(ShareCandidateData::class)]
        public readonly array $candidates,
        public readonly SavedSharePreviewData|null $savedPreview,
        public readonly RootShareData|null $liveShare,
        #[DataCollectionOf(RootShareData::class)]
        public readonly array $openProposals,
    ) {}
}
