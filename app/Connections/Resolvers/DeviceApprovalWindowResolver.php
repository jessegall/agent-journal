<?php

declare(strict_types=1);

namespace App\Connections\Resolvers;

use App\Connections\Models\DeviceGrant;
use App\Http\Data\Connections\DeviceApprovalData;
use App\Http\Requests\Connections\DeviceApprovalPageRequest;
use App\Ui\Contracts\PageResolver;

/**
 * The device code the owner checks before approving it.
 */
final readonly class DeviceApprovalWindowResolver implements PageResolver
{
    public function __construct(private DeviceApprovalPageRequest $page) {}

    public function read(): DeviceApprovalData
    {
        $grant = DeviceGrant::ofUserCode($this->page->userCode());

        return DeviceApprovalData::from([
            'userCode' => $grant->user_code,
            'projectLabel' => $grant->binding->project_label,
            'machineLabel' => $grant->binding->machine_label,
            'scopes' => $grant->scopes,
            'expiresAt' => $grant->code_expires_at->toIso8601String(),
        ]);
    }
}
