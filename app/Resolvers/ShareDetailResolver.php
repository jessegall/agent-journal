<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\PageResolver;
use App\Data\Sharing\ShareAuditData;
use App\Data\Sharing\ShareControlsPartData;
use App\Data\Sharing\ShareMemberData;
use App\Data\Sharing\ShareRuntimeData;
use App\Enums\ShareState;
use App\Exceptions\ShareUnavailable;
use App\Http\Requests\Sharing\ShareRequest;
use App\Models\Share;
use App\Models\ShareMember;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBodyData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use App\Support\ShareAuditResolver;
use App\Support\ShareLinkResolver;

/**
 * One share for its owner as a detail layout: its number and state in the header; under it, on every tab, its direct
 * controls (reveal, retry and revoke, native so its address stays in the browser alone) and its gateway's runtime;
 * then the Share tab with its facts and members, or the Audit tab, read only when chosen, a page at a time.
 */
final readonly class ShareDetailResolver implements PageResolver
{
    public function __construct(
        private ShareRequest $request,
        private CurrentActor $actors,
        private ShareLinkResolver $links,
        private ShareAuditResolver $audits,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $share = Share::byId($this->request->shareId())->getOrThrow(ShareUnavailable::for($this->request->shareId()));

        $controls = ShareControlsPartData::from([
            'id' => $share->id,
            'state' => $share->state,
            'mayReveal' => $this->links->linkFor($this->actors->actor(), $share->id)->isDefined(),
            'mayRetry' => $share->state->mayRetry() && $share->expires_at->isFuture(),
            'mayRevoke' => ! $share->state->isTerminal(),
        ]);

        $title = ($share->state === ShareState::Proposed ? 'Proposal' : 'Share')." {$share->number}";

        return PublicationPage::make(
            $title,
            [LayoutPartData::text('state', $share->state->value, 'muted')],
            "A share of a {$share->root_type}.",
            fn () => LayoutBodyData::fromMarkdown(''),
            [
                PublicationTab::deferred('share', 'Share', fn () => $this->factsOf($share)),
                PublicationTab::deferred('audit', 'Audit', fn () => $this->auditOf($share)),
            ],
        )->withStanding(
            LayoutPartData::native('controls', LayoutNativeData::of('sharing/ShareControls', $controls)),
            LayoutPartData::native(
                'runtime',
                LayoutNativeData::of('sharing/RuntimeSection', ShareRuntimeData::fromShare($share)),
            ),
        )->layout($this->request->chosenTab());
    }

    /**
     * One page of the share's audit from the window's cursor, drawn by its native part, which formats each moment in
     * the viewer's own zone.
     */
    private function auditOf(Share $share): LayoutPartData
    {
        $audit = ShareAuditData::fromPage($this->audits->page($share, $this->request->auditAfter()));

        return LayoutPartData::native('audit', LayoutNativeData::of('sharing/AuditSection', $audit));
    }

    /**
     * The share's state, record, gateway and expiry, then the linked records shared with it, or a notice that none is.
     */
    private function factsOf(Share $share): LayoutPartData
    {
        $members = array_map(ShareMemberData::fromMember(...), ShareMember::currentOf($share));

        $parts = [
            LayoutPartData::collection('facts', 'facts', [
                new LayoutRowData('state', 'State', $share->state->value),
                new LayoutRowData('record', 'Record', $share->root_type),
                new LayoutRowData('gateway', 'Gateway', $share->gatewayKey() ?? 'None yet'),
            ]),
            LayoutPartData::time('expires', 'Expires', $share->expires_at->toIso8601String()),
        ];

        $parts[] = $members === []
            ? LayoutPartData::notice('members', 'empty', 'No linked record is shared with it.')
            : LayoutPartData::collection('members', 'list', array_map(
                fn (ShareMemberData $member) => new LayoutRowData($member->targetId, $member->targetType),
                $members,
            ));

        return LayoutPartData::box('share', 'stack', ...$parts);
    }
}
