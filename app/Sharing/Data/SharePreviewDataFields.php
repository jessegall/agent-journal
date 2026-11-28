<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class SharePreviewDataFields
{
    private string $rootReference;

    private string $rootTitle;

    /** @var list<ShareCandidateData> */
    private array $candidates;

    /** @var list<RootShareData> */
    private array $openProposals;

    private SavedSharePreviewData|Optional $savedPreview;

    private RootShareData|Optional $liveShare;

    public function __construct()
    {
        $this->savedPreview = new Optional();
        $this->liveShare = new Optional();
    }

    public function rootReference(string $reference): self
    {
        $this->rootReference = $reference;

        return $this;
    }

    public function rootTitle(string $title): self
    {
        $this->rootTitle = $title;

        return $this;
    }

    /** @param list<ShareCandidateData> $candidates */
    public function candidates(array $candidates): self
    {
        $this->candidates = $candidates;

        return $this;
    }

    /** @param  list<RootShareData>  $proposals */
    public function openProposals(array $proposals): self
    {
        $this->openProposals = $proposals;

        return $this;
    }

    public function savedPreview(SavedSharePreviewData|Optional $preview): self
    {
        $this->savedPreview = $preview;

        return $this;
    }

    public function liveShare(RootShareData|Optional $share): self
    {
        $this->liveShare = $share;

        return $this;
    }

    public function finish(): SharePreviewData
    {
        if (! isset($this->rootReference)) {
            throw MissingFields::forType(SharePreviewData::class, 'rootReference');
        }

        if (! isset($this->rootTitle)) {
            throw MissingFields::forType(SharePreviewData::class, 'rootTitle');
        }

        if (! isset($this->candidates)) {
            throw MissingFields::forType(SharePreviewData::class, 'candidates');
        }

        if (! isset($this->openProposals)) {
            throw MissingFields::forType(SharePreviewData::class, 'openProposals');
        }

        return new SharePreviewData(
            rootReference: $this->rootReference,
            rootTitle: $this->rootTitle,
            candidates: $this->candidates,
            openProposals: $this->openProposals,
            savedPreview: $this->savedPreview,
            liveShare: $this->liveShare,
        );
    }
}
