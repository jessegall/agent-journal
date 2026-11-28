<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Connections\Layout\LayoutBodyData;
use App\Models\Sharing\Share;
use App\Sharing\Data\ShareAuditData;
use App\Sharing\Data\ShareControlsPartData;
use App\Sharing\Data\ShareMemberData;
use App\Sharing\Data\ShareRuntimeData;
use App\Sharing\Enums\ShareStatus;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use Closure;

/**
 * One share for its owner as a detail layout: its number and state in the header; under it, on every tab, its direct
 * controls (reveal, retry and revoke, native so its address stays in the browser alone) and its gateway's runtime;
 * then the Share tab with its facts and members, or the Audit tab, read only when chosen, a page at a time.
 */
final readonly class SharesShow extends SharingPage
{
    /**
     * @param  Closure(): ShareAuditData  $audit  reads one page of the share's audit, only when its tab is chosen
     * @param  Closure(): list<ShareMemberData>  $members  reads the records shared with it, only when its tab is chosen
     */
    public function of(
        Share $share,
        ShareControlsPartData $controls,
        string $chosenTab,
        Closure $audit,
        Closure $members,
    ): DeclaredLayoutData {
        $title = ($share->status === ShareStatus::Proposed ? 'Proposal' : 'Share')." {$share->number}";

        return PublicationPage::build()
            ->title($title)
            ->metadata(
                [LayoutPartData::build()
                    ->asText()
                    ->key('state')
                    ->value($share->status->value)
                    ->style('muted')
                    ->finish()],
            )
            ->summary("A share of a {$share->root_type}.")
            ->body(fn () => LayoutBodyData::fromMarkdown(''))
            ->tabs(
                [
                    PublicationTab::deferred('share', 'Share', fn () => $this->factsOf($share, $members())),
                    PublicationTab::deferred(
                        'audit',
                        'Audit',
                        fn () => LayoutPartData::build()
                            ->asNative()
                            ->key('audit')
                            ->native(
                                LayoutNativeData::build()->component('sharing/AuditSection')->props($audit())->finish(),
                            )
                            ->finish(),
                    ),
                ],
            )
            ->finish()->withStanding(
                LayoutPartData::build()
                    ->asNative()
                    ->key('controls')
                    ->native(
                        LayoutNativeData::build()->component('sharing/ShareControls')->props($controls)->finish(),
                    )
                    ->finish(),
                LayoutPartData::build()
                    ->asNative()
                    ->key('runtime')
                    ->native(
                        LayoutNativeData::build()
                            ->component('sharing/RuntimeSection')
                            ->props(ShareRuntimeData::fromShare($share))
                            ->finish(),
                    )
                    ->finish(),
            )->layout($chosenTab);
    }

    /**
     * The share's state, record, gateway and expiry, then the linked records shared with it, or a notice that none is.
     *
     * @param  list<ShareMemberData>  $members
     */
    private function factsOf(Share $share, array $members): LayoutPartData
    {
        $parts = [
            LayoutPartData::build()
                ->asCollection()
                ->key('facts')
                ->style('facts')
                ->rows(
                    [
                        LayoutRowData::build()
                            ->key('state')
                            ->label('State')
                            ->value($share->status->value)
                            ->finish(),
                        LayoutRowData::build()
                            ->key('record')
                            ->label('Record')
                            ->value($share->root_type)
                            ->finish(),
                        LayoutRowData::build()
                            ->key('gateway')
                            ->label('Gateway')
                            ->value($share->gatewayKey() ?? 'None yet')
                            ->finish(),
                    ],
                )
                ->finish(),
            LayoutPartData::build()
                ->asTime()
                ->key('expires')
                ->label('Expires')
                ->detail($share->expires_at->toIso8601String())
                ->finish(),
        ];

        $parts[] = $members === []
            ? LayoutPartData::build()
                ->asNotice()
                ->key('members')
                ->style('empty')
                ->title('No linked record is shared with it.')
                ->finish()
            : LayoutPartData::build()
                ->asCollection()
                ->key('members')
                ->style('list')
                ->rows(
                    array_map(
                        fn (ShareMemberData $member) => LayoutRowData::build()
                            ->key($member->targetId)
                            ->label($member->targetType)
                            ->finish(),
                        $members,
                    ),
                )
                ->finish();

        return LayoutPartData::build()->asBox()->key('share')->style('stack')->children(...$parts)->finish();
    }
}
