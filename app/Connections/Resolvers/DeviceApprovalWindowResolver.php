<?php

declare(strict_types=1);

namespace App\Connections\Resolvers;

use App\Agents\Support\ServerOrigin;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\DeviceGrant;
use App\Http\Data\Connections\DeviceApprovalData;
use App\Http\Requests\Connections\DeviceApprovalPageRequest;
use App\Ui\Contracts\PageResolver;
use Carbon\CarbonImmutable;

/**
 * The terminal request the owner checks before approving it, as the journal holds it now, so a reload or a second
 * tab shows its committed state. An unknown code finds nothing, as a code of another owner does.
 */
final readonly class DeviceApprovalWindowResolver implements PageResolver
{
    public function __construct(private DeviceApprovalPageRequest $page, private ServerOrigin $origin) {}

    public function read(): DeviceApprovalData
    {
        $grant = DeviceGrant::ofUserCode($this->page->userCode());

        return DeviceApprovalData::from([
            'userCode' => $grant->user_code,
            'projectLabel' => $grant->binding->project_label,
            'machineLabel' => $grant->binding->machine_label,
            'scopes' => $grant->scopes,
            'expiresAt' => $grant->code_expires_at->toIso8601String(),
            'journalOrigin' => $this->origin->canonical(),
            'environmentLabel' => $grant->environment?->label ?? 'no environment yet',
            'state' => $grant->approvalStateAt(CarbonImmutable::now()),
            'isBindingRevoked' => $grant->binding->readiness === BindingReadiness::Revoked,
        ]);
    }
}
