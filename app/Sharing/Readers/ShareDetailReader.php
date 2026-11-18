<?php

declare(strict_types=1);

namespace App\Sharing\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Http\Data\Sharing\ShareAuditData;
use App\Http\Data\Sharing\ShareDetailData;
use App\Http\Data\Sharing\ShareMemberData;
use App\Http\Data\Sharing\ShareRuntimeData;
use App\Http\Requests\Sharing\ShareRequest;
use App\Sharing\Exceptions\ShareUnavailable;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\ShareAuditReader;
use App\Sharing\Support\ShareLinkReader;
use App\Ui\Contracts\PageReader;
use PhpOption\None;

/**
 * One share for its owner: its state, root, gateway, deadline and current members, and whether it may be revealed,
 * retried or revoked now. Its address is left out; only the reveal action answers with it.
 */
final readonly class ShareDetailReader implements PageReader
{
    public function __construct(
        private ShareRequest $request,
        private CurrentActor $actors,
        private ShareLinkReader $links,
        private ShareAuditReader $audits,
    ) {}

    public function read(): ShareDetailData
    {
        $share = Share::byId($this->request->shareId())->getOrThrow(ShareUnavailable::for($this->request->shareId()));
        $configurationId = $share->share_gateway_configuration_id;

        return new ShareDetailData(
            $share->id,
            $share->number,
            $share->state,
            $share->root_type,
            $share->root_id,
            $configurationId === null ? null : (ShareGatewayConfiguration::gatewayKeysOf([$configurationId])[$configurationId] ?? null),
            $share->scope_version,
            $share->expires_at->toIso8601String(),
            array_map(ShareMemberData::fromMember(...), ShareMember::currentOf($share)),
            $this->links->linkFor($this->actors->actor(), $share->id)->isDefined(),
            $share->state->mayRetry() && $share->expires_at->isFuture(),
            ! $share->state->isTerminal(),
            ShareAuditData::fromPage($this->audits->page($share, $this->request->auditAfter())),
            $this->runtime($share),
        );
    }

    /**
     * The sharing service's hold on the gateways and the newest endpoint serving the share's configuration.
     */
    private function runtime(Share $share): ShareRuntimeData
    {
        $endpoint = $share->share_gateway_configuration_id === null
            ? None::create()
            : ShareGatewayEndpoint::newestRunningOf(ShareGatewayConfiguration::query()->findOrFail($share->share_gateway_configuration_id));

        return new ShareRuntimeData(
            ! ShareInstallation::hasLiveRun(),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->endpoint_version)->getOrElse(null),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->last_health_at?->toIso8601String())->getOrElse(null),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->isHealthy())->getOrElse(false),
        );
    }
}
