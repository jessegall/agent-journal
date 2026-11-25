<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Data\Sharing\ShareAuditData;
use App\Data\Sharing\ShareControlsPartData;
use App\Data\Sharing\ShareMemberData;
use App\Data\Sharing\ShareRuntimeData;
use App\Enums\ShareState;
use App\Models\Sharing\Share;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBodyData;
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
        $title = ($share->state === ShareState::Proposed ? 'Proposal' : 'Share')." {$share->number}";

        return PublicationPage::make(
            $title,
            [LayoutPartData::text('state', $share->state->value, 'muted')],
            "A share of a {$share->root_type}.",
            fn () => LayoutBodyData::fromMarkdown(''),
            [
                PublicationTab::deferred('share', 'Share', fn () => $this->factsOf($share, $members())),
                PublicationTab::deferred(
                    'audit',
                    'Audit',
                    fn () => LayoutPartData::native('audit', LayoutNativeData::of('sharing/AuditSection', $audit())),
                ),
            ],
        )->withStanding(
            LayoutPartData::native('controls', LayoutNativeData::of('sharing/ShareControls', $controls)),
            LayoutPartData::native(
                'runtime',
                LayoutNativeData::of('sharing/RuntimeSection', ShareRuntimeData::fromShare($share)),
            ),
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
            LayoutPartData::collection('facts', 'facts', [
                LayoutRowData::from([
                    'key' => 'state',
                    'label' => 'State',
                    'value' => $share->state->value,
                ]),
                LayoutRowData::from([
                    'key' => 'record',
                    'label' => 'Record',
                    'value' => $share->root_type,
                ]),
                LayoutRowData::from(
                    [
                        'key' => 'gateway',
                        'label' => 'Gateway',
                        'value' => $share->gatewayKey() ?? 'None yet',
                    ],
                ),
            ]),
            LayoutPartData::time('expires', 'Expires', $share->expires_at->toIso8601String()),
        ];

        $parts[] = $members === []
            ? LayoutPartData::notice('members', 'empty', 'No linked record is shared with it.')
            : LayoutPartData::collection('members', 'list', array_map(
                fn (ShareMemberData $member) => LayoutRowData::from(
                    [
                        'key' => $member->targetId,
                        'label' => $member->targetType,
                    ],
                ),
                $members,
            ));

        return LayoutPartData::box('share', 'stack', ...$parts);
    }
}
