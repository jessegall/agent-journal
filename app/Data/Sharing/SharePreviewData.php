<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's preview page of sharing one root, named as people name it: its latest published title, the linked
 * candidates to select from, its open proposals, and, only when they exist, the last saved preview still open and the
 * root's live share, which a confirmed preview refreshes or approves.
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
        #[DataCollectionOf(RootShareData::class)]
        public readonly array $openProposals,
        public readonly SavedSharePreviewData|Optional $savedPreview = new Optional(),
        public readonly RootShareData|Optional $liveShare = new Optional(),
    ) {}
}
